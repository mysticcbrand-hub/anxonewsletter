import { Sparkles, TrendingUp, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Contenido exclusivo',
    description: 'Estrategias y recursos que no encontrarás en redes sociales',
  },
  {
    icon: TrendingUp,
    title: 'Casos de éxito',
    description: 'Historias reales de personas que aplican estas ideas',
  },
  {
    icon: Zap,
    title: 'Accionable y directo',
    description: 'Sin teoría aburrida. Solo lo que funciona, listo para aplicar',
  },
];

const FeaturesSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">
        ¿Qué vas a recibir?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 glass-card glass-card-hover"
          >
            <div className="feature-icon mb-6">
              <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-foreground/60 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
