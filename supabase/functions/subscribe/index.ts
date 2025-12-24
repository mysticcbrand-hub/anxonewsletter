import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Rate limiting: simple in-memory store (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // max requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://ytnsknoywsphpwpjgnxw.lovableproject.com',
  'https://lovable.dev',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://anxonewsletter.vercel.app',
  'https://ladosis.vercel.app',
];

function getCorsHeaders(origin: string | null) {
  // Allow any lovable.dev or lovableproject.com subdomain
  const isLovableOrigin = origin && (
    origin.endsWith('.lovable.dev') || 
    origin.endsWith('.lovableproject.com') ||
    origin.endsWith('.lovable.app') ||
    ALLOWED_ORIGINS.includes(origin)
  );
  
  return {
    "Access-Control-Allow-Origin": isLovableOrigin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

interface SubscribeRequest {
  email: string;
  name?: string;
}

// Robust email validation
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  
  const trimmed = email.trim();
  
  // RFC 5321 max length
  if (trimmed.length > 254) return false;
  if (trimmed.length < 5) return false;
  
  // More robust email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;
  
  // Check for suspicious patterns (SQL injection, script injection)
  // Note: This is a character class (NOT a full SQLi detector). Keep it simple and lint-friendly.
  const suspiciousPatterns = /[<>'";/*-]/;
  if (suspiciousPatterns.test(trimmed.split('@')[0])) return false;
  
  return true;
}

// Validate and sanitize name field
function validateAndSanitizeName(name: unknown): { valid: boolean; sanitized?: string; error?: string } {
  if (name === undefined || name === null) {
    return { valid: true }; // Name is optional
  }
  
  if (typeof name !== "string") {
    return { valid: false, error: "Nombre inválido" };
  }
  
  const trimmed = name.trim();
  
  // Length validation
  if (trimmed.length < 2) {
    return { valid: false, error: "El nombre debe tener al menos 2 caracteres" };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: "El nombre es demasiado largo" };
  }
  
  // Remove HTML tags and dangerous characters
  const sanitized = trimmed.replace(/<[^>]*>/g, '').slice(0, 100);
  
  // Check for suspicious patterns (injection attempts)
  // Avoid control characters (0x00-0x1F) and common injection punctuation.
  const hasControlChars = [...sanitized].some((ch) => ch.charCodeAt(0) < 0x20);
  const hasBadPunctuation = /[<>'";]/.test(sanitized);
  if (hasControlChars || hasBadPunctuation) {
    return { valid: false, error: "El nombre contiene caracteres no permitidos" };
  }
  
  return { valid: true, sanitized };
}

// Check rate limit by IP
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Generic error responses (no internal details exposed)
const ERROR_MESSAGES = {
  RATE_LIMITED: "Demasiadas solicitudes. Intenta más tarde.",
  INVALID_EMAIL: "Por favor ingresa un email válido.",
  INVALID_NAME: "Por favor ingresa un nombre válido.",
  ALREADY_SUBSCRIBED: "Este email ya está suscrito.",
  SERVER_ERROR: "No se pudo procesar la suscripción. Intenta más tarde.",
  CONFIG_ERROR: "Servicio temporalmente no disponible.",
};

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("cf-connecting-ip") || 
                   "unknown";

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    console.warn(`Rate limited IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: ERROR_MESSAGES.RATE_LIMITED }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Limit request body size
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 1024) {
      return new Response(
        JSON.stringify({ error: ERROR_MESSAGES.INVALID_EMAIL }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, name }: SubscribeRequest = await req.json();
    
    // Validate email
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: ERROR_MESSAGES.INVALID_EMAIL }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate and sanitize name
    const nameValidation = validateAndSanitizeName(name);
    if (!nameValidation.valid) {
      console.warn(`Invalid name attempt from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: nameValidation.error || ERROR_MESSAGES.INVALID_NAME }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const apiKey = Deno.env.get("MAILERLITE_API_KEY");
    if (!apiKey) {
      console.error("MAILERLITE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: ERROR_MESSAGES.CONFIG_ERROR }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const groupId = Deno.env.get("MAILERLITE_GROUP_ID") || "174690786914338270";
    const sanitizedEmail = email.trim().toLowerCase();
    
    console.log(`Subscribing email: ${sanitizedEmail.substring(0, 3)}***`);

    const subscriberData: { email: string; groups?: string[]; fields?: { name: string } } = {
      email: sanitizedEmail,
    };
    
    // Add group if configured
    if (groupId) {
      subscriberData.groups = [groupId];
      console.log(`Adding to group: ${groupId}`);
    }
    
    // Add sanitized name if provided
    if (nameValidation.sanitized) {
      subscriberData.fields = { name: nameValidation.sanitized };
      console.log(`With name: ${nameValidation.sanitized.substring(0, 2)}***`);
    }

    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(subscriberData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log detailed error server-side only
      console.error("MailerLite API error:", response.status, JSON.stringify(data));
      console.error("Sent data:", JSON.stringify(subscriberData));
      console.error("Response headers:", JSON.stringify(Object.fromEntries(response.headers.entries())));
      
      // Return generic message to client, but include more details for debugging
      if (response.status === 422 || response.status === 409 || data.message?.includes("already exists")) {
        return new Response(
          JSON.stringify({ 
            error: ERROR_MESSAGES.ALREADY_SUBSCRIBED,
            debug: { status: response.status, message: data.message }
          }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: ERROR_MESSAGES.SERVER_ERROR,
          debug: { status: response.status, message: data.message }
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Successfully subscribed");
    return new Response(
      JSON.stringify({ success: true, message: "Suscripción exitosa" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    // Log detailed error server-side only
    console.error("Error in subscribe function:", error);
    return new Response(
      JSON.stringify({ error: ERROR_MESSAGES.SERVER_ERROR }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});