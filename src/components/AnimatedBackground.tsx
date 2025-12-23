const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 bg-background -z-10 overflow-hidden">
      {/* Base gradient layer - smooth transitions with yellow/orange tones only */}
      <div 
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 50% at 20% 30%,
              hsl(45 100% 50% / 0.15),
              transparent 50%
            ),
            radial-gradient(
              ellipse 80% 50% at 80% 70%,
              hsl(35 100% 45% / 0.12),
              transparent 50%
            ),
            radial-gradient(
              ellipse 100% 80% at 50% 50%,
              hsl(42 100% 48% / 0.08),
              transparent 70%
            ),
            hsl(0 0% 4%)
          `,
        }}
      />
      
      {/* Animated gradient orbs with smooth blur - yellow/orange spectrum only */}
      <div className="absolute inset-0 mix-blend-screen opacity-40">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] rounded-full blur-[150px] md:blur-[200px] lg:blur-[250px] animate-float-slow"
          style={{
            background: 'radial-gradient(circle, hsl(45 100% 55% / 0.6) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] rounded-full blur-[130px] md:blur-[180px] lg:blur-[230px] animate-float-reverse-slow"
          style={{
            background: 'radial-gradient(circle, hsl(38 100% 50% / 0.5) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] rounded-full blur-[170px] md:blur-[220px] lg:blur-[280px] animate-drift-slow"
          style={{
            background: 'radial-gradient(circle, hsl(40 100% 48% / 0.4) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Subtle vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(0 0% 4% / 0.6) 100%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
