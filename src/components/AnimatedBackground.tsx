const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 bg-background -z-10 overflow-hidden">
      {/* Gradient orbs - más intensos y visibles, más grandes en desktop */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] bg-primary rounded-full blur-[150px] md:blur-[200px] lg:blur-[250px] opacity-30 animate-float"
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] bg-secondary rounded-full blur-[130px] md:blur-[180px] lg:blur-[230px] opacity-25 animate-float-reverse"
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] bg-primary/50 rounded-full blur-[170px] md:blur-[220px] lg:blur-[280px] opacity-15 animate-drift"
        />
      </div>
      {/* Subtle radial gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(0 0% 4%) 70%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
