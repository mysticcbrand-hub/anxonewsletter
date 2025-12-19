const SocialProofSection = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      {/* Subscriber count */}
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground/[0.03] border border-foreground/[0.08] mb-12">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary" />
        </div>
        <span className="text-sm text-foreground/60">
          Únete a <span className="text-primary font-semibold">2,500+</span> suscriptores
        </span>
      </div>

      {/* Testimonial */}
      <blockquote className="text-xl md:text-2xl text-foreground/70 italic mb-4 leading-relaxed">
        "Cada email es como una masterclass de 5 minutos. 
        Vale oro."
      </blockquote>
      <cite className="text-sm text-foreground/40 not-italic">
        — Laura M., Product Designer
      </cite>
    </section>
  );
};

export default SocialProofSection;
