const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 bg-black -z-10 overflow-hidden">
      {/* Dynamic radial gradient - Apple style with stronger effect */}
      <div 
        className="absolute inset-0 animate-gradient-shift-fast"
        style={{
          background: `
            radial-gradient(
              circle 800px at 50% 50%,
              hsl(45 100% 55% / 0.35),
              hsl(40 100% 50% / 0.25) 30%,
              hsl(35 100% 45% / 0.15) 50%,
              hsl(30 90% 40% / 0.08) 70%,
              transparent 100%
            )
          `,
        }}
      />
      
      {/* Animated gradient orbs - more intense and faster */}
      <div className="absolute inset-0 mix-blend-screen opacity-50">
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] rounded-full blur-[120px] md:blur-[160px] lg:blur-[200px] animate-float-fast"
          style={{
            background: 'radial-gradient(circle, hsl(45 100% 60% / 0.8) 0%, hsl(42 100% 55% / 0.4) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] lg:w-[1100px] lg:h-[1100px] rounded-full blur-[100px] md:blur-[140px] lg:blur-[180px] animate-float-reverse-fast"
          style={{
            background: 'radial-gradient(circle, hsl(38 100% 55% / 0.7) 0%, hsl(35 100% 50% / 0.35) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] lg:w-[1400px] lg:h-[1400px] rounded-full blur-[140px] md:blur-[180px] lg:blur-[220px] animate-drift-fast"
          style={{
            background: 'radial-gradient(circle, hsl(40 100% 52% / 0.6) 0%, hsl(38 100% 48% / 0.3) 40%, transparent 70%)'
          }}
        />
      </div>

      {/* Strong radial vignette - black edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at center, transparent 0%, hsl(0 0% 0% / 0.4) 50%, hsl(0 0% 0% / 0.9) 100%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
