const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 bg-black -z-10 overflow-hidden">
      {/* Dynamic radial gradient - subtle Apple style */}
      <div 
        className="absolute inset-0 animate-gradient-shift-fast"
        style={{
          background: `
            radial-gradient(
              circle 500px at 50% 50%,
              hsl(45 100% 50% / 0.12),
              hsl(40 100% 45% / 0.08) 30%,
              hsl(35 90% 40% / 0.04) 50%,
              transparent 70%
            )
          `,
        }}
      />
      
      {/* Animated gradient orbs - subtle and muted */}
      <div className="absolute inset-0 mix-blend-screen opacity-25">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] rounded-full blur-[120px] md:blur-[160px] lg:blur-[200px] animate-float-fast"
          style={{
            background: 'radial-gradient(circle, hsl(45 100% 55% / 0.4) 0%, hsl(42 100% 50% / 0.2) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full blur-[100px] md:blur-[140px] lg:blur-[180px] animate-float-reverse-fast"
          style={{
            background: 'radial-gradient(circle, hsl(38 100% 50% / 0.35) 0%, hsl(35 100% 45% / 0.18) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] rounded-full blur-[140px] md:blur-[180px] lg:blur-[220px] animate-drift-fast"
          style={{
            background: 'radial-gradient(circle, hsl(40 100% 48% / 0.3) 0%, hsl(38 95% 45% / 0.15) 40%, transparent 70%)'
          }}
        />
      </div>

      {/* Strong vignette - mostly black */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 50% 45% at center, transparent 0%, hsl(0 0% 0% / 0.6) 40%, hsl(0 0% 0% / 0.95) 100%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
