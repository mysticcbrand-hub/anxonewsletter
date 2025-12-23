const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 bg-black -z-10 overflow-hidden">
      {/* Dynamic radial gradient - balanced intensity */}
      <div 
        className="absolute inset-0 animate-gradient-shift-fast"
        style={{
          background: `
            radial-gradient(
              circle 650px at 50% 50%,
              hsl(45 100% 52% / 0.20),
              hsl(40 100% 48% / 0.14) 30%,
              hsl(35 95% 42% / 0.08) 50%,
              transparent 75%
            )
          `,
        }}
      />
      
      {/* Animated gradient orbs - balanced */}
      <div className="absolute inset-0 mix-blend-screen opacity-35">
        <div 
          className="absolute top-1/4 left-1/4 w-[550px] h-[550px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] rounded-full blur-[120px] md:blur-[160px] lg:blur-[200px] animate-float-fast"
          style={{
            background: 'radial-gradient(circle, hsl(45 100% 56% / 0.55) 0%, hsl(42 100% 52% / 0.28) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] rounded-full blur-[100px] md:blur-[140px] lg:blur-[180px] animate-float-reverse-fast"
          style={{
            background: 'radial-gradient(circle, hsl(38 100% 52% / 0.48) 0%, hsl(35 100% 48% / 0.24) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1100px] lg:h-[1100px] rounded-full blur-[140px] md:blur-[180px] lg:blur-[220px] animate-drift-fast"
          style={{
            background: 'radial-gradient(circle, hsl(40 100% 50% / 0.42) 0%, hsl(38 98% 46% / 0.20) 40%, transparent 70%)'
          }}
        />
      </div>

      {/* Balanced vignette - dark but not too strong */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 55% at center, transparent 0%, hsl(0 0% 0% / 0.5) 45%, hsl(0 0% 0% / 0.88) 100%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
