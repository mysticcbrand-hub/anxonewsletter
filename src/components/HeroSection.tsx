import { Zap, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32 relative">
      {/* Logo/Badge */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="w-7 h-7 text-primary-foreground" strokeWidth={2} />
        </div>
        <span className="text-xl font-semibold tracking-tight">Newsletter</span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 max-w-4xl leading-tight">
        Ideas que inspiran,
        <span className="block text-primary">directo a tu inbox</span>
      </h1>

      {/* Subheadline */}
      <p className="text-xl md:text-2xl text-foreground/60 text-center mb-12 max-w-2xl leading-relaxed">
        Cada semana, las mejores estrategias de productividad, 
        creatividad y tecnología que realmente funcionan.
      </p>

      {/* CTA Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] mb-8">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-sm text-foreground/60">100% gratis · Sin spam</span>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-foreground/20" strokeWidth={1.5} />
      </div>
    </section>
  );
};

export default HeroSection;
