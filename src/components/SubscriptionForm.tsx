import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    
    // Simular envío (demo only)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 glass-card">
      {!submitted ? (
        <>
          <h3 className="text-2xl font-semibold mb-2 text-center">Mantente al día</h3>
          <p className="text-sm text-foreground/60 text-center mb-6">
            Recibe contenido exclusivo directamente en tu inbox
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className={`w-full px-5 py-4 glass-input ${
                  error ? 'border-destructive/40' : ''
                }`}
              />
              {error && (
                <p className="text-xs text-destructive mt-2 ml-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Suscribiendo...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" strokeWidth={2} />
                  <span>Suscribirme gratis</span>
                </>
              )}
            </button>

            <p className="text-xs text-foreground/30 text-center">
              Sin spam. Cancela cuando quieras.
            </p>
          </form>
        </>
      ) : (
        <div className="text-center py-8 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-semibold mb-2">¡Bienvenido a bordo!</h3>
          <p className="text-foreground/60">
            Revisa tu email para confirmar tu suscripción
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionForm;
