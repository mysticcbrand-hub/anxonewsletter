import { useState, useEffect, useCallback } from 'react';
import { Check, AlertCircle, User, Phone, Play, Mail, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import { supabase } from '@/integrations/supabase/client';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'anxonews_subscribers';
const RATE_LIMIT_KEY = 'anxonews_rate_limit';
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

const PERSIST_KEY = 'anxonews_flow_v1';
const MAX_PERSIST_AGE = 24 * 60 * 60 * 1000; // 24 hours

type FormStep = 'email' | 'details' | 'success' | 'setup' | 'completed' | 'already-subscribed';

type PersistedState = {
  step: FormStep;
  email: string;
  name: string;
  phone?: string;
  acceptedPrivacy: boolean;
  savedName: string;
  setupChecks: { filter: boolean; primary: boolean };
  timestamp: number;
};

interface MinimalNewsletterProps {
  onStepChange?: (step: string) => void;
}

const MinimalNewsletter = ({ onStepChange }: MinimalNewsletterProps = {}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [step, setStep] = useState<FormStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedName, setSavedName] = useState('');
  const [setupChecks, setSetupChecks] = useState({ filter: false, primary: false });
  const [countdown, setCountdown] = useState(5 * 60); // 5 minutes in seconds

  // Restore persisted state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedState;
      const now = Date.now();
      if (!parsed || typeof parsed !== 'object') return;
      if (now - parsed.timestamp > MAX_PERSIST_AGE) {
        localStorage.removeItem(PERSIST_KEY);
        return;
      }
      // Basic validation to avoid invalid jumps
      const validSteps: FormStep[] = ['email', 'details', 'success', 'setup', 'completed', 'already-subscribed'];
      const nextStep: FormStep = validSteps.includes(parsed.step) ? parsed.step : 'email';
      if (nextStep === 'details' && !parsed.email) {
        // cannot be on details without email
        parsed.step = 'email';
      }
      setEmail(parsed.email || '');
      setName(parsed.name || '');
      setPhone(parsed.phone);
      setAcceptedPrivacy(!!parsed.acceptedPrivacy);
      setSavedName(parsed.savedName || '');
      setSetupChecks(parsed.setupChecks || { filter: false, primary: false });
      setStep(parsed.step || 'email');
    } catch {
      // ignore
    }
  }, []);

  // Persist state on changes
  useEffect(() => {
    const data: PersistedState = {
      step,
      email,
      name,
      phone,
      acceptedPrivacy,
      savedName,
      setupChecks,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
    
    // Notificar cambio de paso al componente padre
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, email, name, phone, acceptedPrivacy, setupChecks, savedName, onStepChange]);

  // Countdown timer effect
  useEffect(() => {
    if (step !== 'success' && step !== 'setup') return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // Confetti effect on completion
  useEffect(() => {
    if (step !== 'completed') return;

    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#FFD60A', '#FFCC00', '#FF9F0A', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        scalar: 0.9,
        drift: 0,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        scalar: 0.9,
        drift: 0,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [step]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 255;
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/<[^>]*>/g, '').slice(0, 100);
  };

  const getSubscribers = (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const addSubscriber = (email: string) => {
    const subscribers = getSubscribers();
    if (!subscribers.includes(email.toLowerCase())) {
      subscribers.push(email.toLowerCase());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
    }
  };

  const isEmailRegistered = (email: string): boolean => {
    const subscribers = getSubscribers();
    return subscribers.includes(email.toLowerCase());
  };

  const checkRateLimit = (): boolean => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) return true;
      
      const { attempts, timestamp } = JSON.parse(stored);
      const now = Date.now();
      
      if (now - timestamp > RATE_LIMIT_WINDOW) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: 1, timestamp: now }));
        return true;
      }
      
      if (attempts >= MAX_ATTEMPTS) {
        return false;
      }
      
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts: attempts + 1, timestamp }));
      return true;
    } catch {
      return true;
    }
  };

  const handleEmailContinue = () => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!validateEmail(trimmedEmail)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (!checkRateLimit()) {
      setError('Demasiados intentos. Espera una hora.');
      return;
    }

    if (isEmailRegistered(trimmedEmail)) {
      setStep('already-subscribed');
      return;
    }

    setError('');
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedName = sanitizeInput(name);
    const trimmedEmail = email.trim().toLowerCase();

    if (!sanitizedName || sanitizedName.length < 2) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      setError('Por favor ingresa un teléfono válido');
      return;
    }

    if (!acceptedPrivacy) {
      setError('Debes aceptar la Política de Privacidad');
      return;
    }
    
    setLoading(true);
    setError('');
    
    console.log('[DEBUG] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('[DEBUG] Anon key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
    console.log('[DEBUG] Supabase client:', supabase);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('subscribe', {
        body: { email: trimmedEmail, name: sanitizedName },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      
      if (fnError) {
        throw fnError;
      }
      
      if (data?.error) {
        setError(data.error);
      } else {
        addSubscriber(trimmedEmail);
        setSavedName(sanitizedName);
        setStep('success');
        setEmail('');
        setName('');
        setPhone('');
        setAcceptedPrivacy(false);
      }
    } catch (err: unknown) {
      console.error('Subscribe error:', err);
      const message = err instanceof Error ? err.message : undefined;
      setError(message || 'Error de conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToSetup = () => {
    setStep('setup');
  };

  const handleCompleteSetup = () => {
    setStep('completed');
  };

  // Clear persisted state when flow is completed
  useEffect(() => {
    if (step === 'completed') {
      try {
        localStorage.removeItem(PERSIST_KEY);
      } catch {
        // ignore
      }
    }
  }, [step]);

  const allChecksCompleted = setupChecks.filter && setupChecks.primary;

  const currentStepNumber = step === 'email' ? 1 : step === 'details' ? 2 : step === 'success' ? 3 : step === 'setup' ? 4 : 4;
  return (
    <>
      {/* Progress bar - hidden on completed */}
      {step !== 'completed' && <ProgressBar currentStep={currentStepNumber as 1 | 2 | 3 | 4} />}
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="max-w-2xl w-full">
        
        {/* Título principal - Solo en email y details */}
        {(step === 'email' || step === 'details') && (
          <>
            <h1 
              className="text-3xl md:text-5xl lg:text-7xl font-light text-center mb-4 md:mb-6 opacity-0 px-2"
              style={{ animation: 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards' }}
            >
              Esto no es para
              <span className="block font-semibold text-primary mt-2 text-glow">todo el mundo.</span>
            </h1>
            
            <p 
              className="text-base md:text-xl lg:text-2xl text-foreground/60 text-center mb-12 md:mb-16 font-light leading-relaxed opacity-0 px-2"
              style={{ animation: 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards' }}
            >
              Mi aprendizaje de años y años,
              <span className="block mt-1">directo a tu móvil.</span>
            </p>
          </>
        )}
        
        {/* Formulario */}
        <div 
          className={step === 'email' || step === 'details' ? 'opacity-0' : ''}
          style={step === 'email' || step === 'details' ? { animation: 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1.4s forwards' } : {}}
        >
          {/* Paso 1: Email */}
          {step === 'email' && (
            <div className="max-w-lg mx-auto px-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
                  placeholder="tu@email.com"
                  className={`flex-1 min-w-0 px-5 md:px-6 py-3.5 md:py-4 rounded-2xl bg-foreground/[0.05] backdrop-blur-xl border ${error ? 'border-destructive/40' : 'border-foreground/10'} focus:bg-foreground/[0.08] focus:border-primary/40 focus:outline-none text-foreground placeholder:text-foreground/30 transition-all duration-300 text-sm md:text-base`}
                />
                <button
                  type="button"
                  onClick={handleEmailContinue}
                  className="px-6 md:px-8 py-3.5 md:py-4 rounded-2xl bg-primary text-primary-foreground font-semibold btn-glow hover:scale-[1.02] transition-all duration-300 whitespace-nowrap text-sm md:text-base"
                >
                  Siguiente
                </button>
              </div>
              {error && (
                <p className="text-xs text-destructive text-center mt-3 animate-fade-in">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Paso 2: Detalles */}
          {step === 'details' && (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-2 animate-fade-in">
              <div className="space-y-3">
                {/* Email (solo lectura) */}
                <div className="px-5 md:px-6 py-3 md:py-3.5 rounded-2xl bg-foreground/[0.03] border border-foreground/5 text-foreground/50 text-sm">
                  {email}
                </div>
                
                {/* Nombre */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="Tu nombre"
                    maxLength={100}
                    className="w-full pl-11 pr-5 md:pr-6 py-3.5 md:py-4 rounded-2xl bg-foreground/[0.05] backdrop-blur-xl border border-foreground/10 focus:bg-foreground/[0.08] focus:border-primary/40 focus:outline-none text-foreground placeholder:text-foreground/30 transition-all duration-300 text-sm md:text-base"
                  />
                </div>
                
                {/* Teléfono */}
                <div className="relative phone-input-wrapper">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 z-10" />
                  <PhoneInput
                    international
                    defaultCountry="ES"
                    value={phone}
                    onChange={setPhone}
                    limitMaxLength
                    countryCallingCodeEditable={false}
                    className="phone-input-custom"
                  />
                </div>

                {/* Checkbox de privacidad */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => { setAcceptedPrivacy(e.target.checked); setError(''); }}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-md border border-foreground/20 bg-foreground/[0.05] peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                      {acceptedPrivacy && (
                        <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-foreground/50 group-hover:text-foreground/70 transition-colors leading-relaxed">
                    Acepto la{' '}
                    <Link 
                      to="/privacidad" 
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Política de Privacidad
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading || !acceptedPrivacy}
                  className="w-full px-6 md:px-8 py-3.5 md:py-4 rounded-2xl bg-primary text-primary-foreground font-semibold btn-glow hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm md:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    'Suscribirme'
                  )}
                </button>
              </div>
              
              {error && (
                <p className="text-xs text-destructive text-center mt-3 animate-fade-in">
                  {error}
                </p>
              )}
            </form>
          )}

          {/* Estado: Ya suscrito */}
          {step === 'already-subscribed' && (
            <div className="text-center py-6 md:py-8 px-4 animate-shake">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-destructive/10 backdrop-blur-xl border border-destructive/30 flex items-center justify-center mx-auto mb-5 md:mb-6"
                style={{ animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
              >
                <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-destructive" strokeWidth={2} />
              </div>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4 text-destructive opacity-0"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards' }}
              >
                Error. Ya te has suscrito
              </h2>
              <p 
                className="text-foreground/50 text-xs md:text-sm max-w-sm mx-auto mb-8 opacity-0"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.35s forwards' }}
              >
                Si no recibiste el email de confirmación, revisa spam
              </p>
              
              {/* Botón glassmorphism */}
              <button
                onClick={() => {
                  setStep('email');
                  setEmail('');
                  setError('');
                }}
                className="group mx-auto px-8 py-3.5 rounded-[20px] bg-[#1a1a1a]/80 backdrop-blur-[40px] border border-white/20 hover:border-white/30 text-white/90 hover:text-white font-medium transition-all duration-300 opacity-0 hover:scale-[1.02] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
                style={{ 
                  animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
                  WebkitBackdropFilter: 'blur(40px)'
                }}
              >
                <span className="flex items-center gap-2">
                  Entendido
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </span>
              </button>
            </div>
          )}

          {/* Estado: Éxito - Email enviado */}
          {step === 'success' && (
            <div className="text-center py-6 md:py-8 px-4">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/30 flex items-center justify-center mx-auto mb-5 md:mb-6 opacity-0"
                style={{ animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards' }}
              >
                <Mail className="w-8 h-8 md:w-10 md:h-10 text-primary" strokeWidth={2} />
              </div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4 text-primary text-glow opacity-0"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards' }}
              >
                Bien hecho.
              </h2>
              <p 
                className="text-foreground/80 text-base md:text-lg lg:text-xl mb-3 opacity-0"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.35s forwards' }}
              >
                Te acabo de mandar un email de confirmación
              </p>
              <p 
                className="text-foreground/50 text-xs md:text-sm max-w-sm mx-auto mb-6 opacity-0"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards' }}
              >
                Haz clic en el enlace del email para completar tu suscripción
              </p>
              
              {/* Countdown Timer */}
              <div 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-foreground/[0.03] backdrop-blur-xl border border-foreground/[0.08] mb-8 opacity-0"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards' }}
              >
                <Clock className={`w-4 h-4 ${countdown <= 60 ? 'text-destructive' : 'text-primary'}`} />
                <span className={`font-mono text-lg font-semibold tabular-nums ${countdown <= 60 ? 'text-destructive' : 'text-foreground'}`}>
                  {formatTime(countdown)}
                </span>
                <span className="text-foreground/40 text-sm">restantes</span>
              </div>

              <button
                onClick={handleContinueToSetup}
                className="px-8 py-4 rounded-2xl bg-foreground/[0.05] backdrop-blur-xl border border-foreground/10 hover:bg-foreground/[0.08] hover:border-primary/30 text-foreground font-medium transition-all duration-300 opacity-0 flex items-center gap-2 mx-auto"
                style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.75s forwards' }}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Estado: Setup - Configuración de Gmail */}
          {step === 'setup' && (
            <div className="px-4 max-w-xl mx-auto pt-8 md:pt-12">
              {/* Saludo */}
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-3 opacity-0 tracking-tight"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards' }}
              >
                Hola, {savedName} <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
              </h2>
              <p 
                className="text-foreground/50 text-center text-base md:text-lg mb-10 md:mb-14 opacity-0 font-light"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards' }}
              >
                Sigue estos pasos para no perderte nada
              </p>

              {/* Video placeholder */}
              <div 
                className="rounded-3xl bg-foreground/[0.02] backdrop-blur-xl border border-foreground/[0.06] p-10 md:p-14 mb-5 opacity-0 hover:bg-foreground/[0.03] hover:border-foreground/[0.1] transition-all duration-500"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards' }}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-18 h-18 md:w-24 md:h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 hover:scale-110 hover:bg-primary/15 transition-all duration-300 cursor-pointer group shadow-lg shadow-primary/5">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-primary ml-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                  </div>
                  <p className="text-foreground/70 text-sm font-medium">Video de configuración</p>
                  <p className="text-foreground/30 text-xs mt-1">1 minuto</p>
                </div>
              </div>

              <p 
                className="text-foreground/35 text-center text-sm mb-8 opacity-0 font-light"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards' }}
              >
                Mira este video de 1 minuto para configurar tu Gmail
              </p>

              {/* Checklist */}
              <div 
                className="rounded-3xl bg-foreground/[0.02] backdrop-blur-xl border border-foreground/[0.06] p-6 md:p-8 mb-8 opacity-0"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards' }}
              >
                <h3 className="text-foreground/90 font-medium mb-6 text-sm tracking-wide uppercase">Marca cuando completes cada paso</h3>
                
                <div className="space-y-4">
                  {/* Check 1 */}
                  <label 
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      setupChecks.filter 
                        ? 'bg-primary/5 border-primary/20 shadow-sm shadow-primary/5' 
                        : 'bg-foreground/[0.01] border-foreground/[0.05] hover:bg-foreground/[0.03] hover:border-foreground/[0.1]'
                    }`}
                  >
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={setupChecks.filter}
                        onChange={(e) => setSetupChecks(prev => ({ ...prev, filter: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        setupChecks.filter 
                          ? 'bg-primary border-primary scale-110' 
                          : 'border-foreground/20 bg-transparent hover:border-foreground/30'
                      }`}>
                        {setupChecks.filter && (
                          <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium transition-colors duration-300 ${setupChecks.filter ? 'text-foreground' : 'text-foreground/80'}`}>1. Configurar filtro de correo</p>
                      <p className="text-foreground/40 text-sm mt-1.5 leading-relaxed font-light">
                        Crear filtro "Nunca Spam" y marcar siempre como importante
                      </p>
                    </div>
                  </label>

                  {/* Check 2 */}
                  <label 
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      setupChecks.primary 
                        ? 'bg-primary/5 border-primary/20 shadow-sm shadow-primary/5' 
                        : 'bg-foreground/[0.01] border-foreground/[0.05] hover:bg-foreground/[0.03] hover:border-foreground/[0.1]'
                    }`}
                  >
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={setupChecks.primary}
                        onChange={(e) => setSetupChecks(prev => ({ ...prev, primary: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        setupChecks.primary 
                          ? 'bg-primary border-primary scale-110' 
                          : 'border-foreground/20 bg-transparent hover:border-foreground/30'
                      }`}>
                        {setupChecks.primary && (
                          <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium transition-colors duration-300 ${setupChecks.primary ? 'text-foreground' : 'text-foreground/80'}`}>2. Mover emails a "Primario"</p>
                      <p className="text-foreground/40 text-sm mt-1.5 leading-relaxed font-light">
                        Arrastra mis emails desde "Promociones" a la pestaña "Primario"
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Botón finalizar */}
              <button
                onClick={handleCompleteSetup}
                disabled={!allChecksCompleted}
                className={`w-full px-8 py-4 rounded-2xl font-medium transition-all duration-500 flex items-center justify-center gap-2.5 opacity-0 ${
                  allChecksCompleted
                    ? 'bg-primary text-primary-foreground btn-glow hover:scale-[1.02] shadow-lg shadow-primary/20'
                    : 'bg-foreground/[0.03] text-foreground/25 cursor-not-allowed border border-foreground/[0.06]'
                }`}
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards' }}
              >
                Ya terminé
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Estado: Completado - Felicitación final */}
          {step === 'completed' && (
            <div className="text-center py-12 md:py-16 px-4">
              <div 
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center mx-auto mb-8 md:mb-10 opacity-0 shadow-xl shadow-primary/10"
                style={{ animation: 'scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards' }}
              >
                <Check className="w-10 h-10 md:w-14 md:h-14 text-primary" strokeWidth={2} />
              </div>
              <h2 
                className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-5 md:mb-6 text-primary text-glow opacity-0 tracking-tight"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.25s forwards' }}
              >
                ¡Perfecto, {savedName}!
              </h2>
              <p 
                className="text-foreground/70 text-lg md:text-xl lg:text-2xl mb-5 opacity-0 font-light"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards' }}
              >
                Ya estás listo para recibir mis emails
              </p>
              <p 
                className="text-foreground/40 text-sm md:text-base max-w-md mx-auto opacity-0 font-light leading-relaxed"
                style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.55s forwards' }}
              >
                Nos vemos muy pronto en tu bandeja de entrada. <br />
                <span className="text-primary font-medium">Gracias por unirte.</span>
              </p>
            </div>
          )}
        </div>
        
      </div>
      
      {/* Footer - solo en email, details */}
      {(step === 'email' || step === 'details') && (
        <div className="fixed bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-foreground/20">Sin spam. Cancela cuando quieras.</p>
        </div>
      )}
    </div>
    </>
  );
};

export default MinimalNewsletter;
