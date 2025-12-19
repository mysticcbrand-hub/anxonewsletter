const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 bg-background -z-10 overflow-hidden">
      {/* Gradient orbs - más intensos y visibles */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-primary rounded-full blur-[180px] opacity-30 animate-float"
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary rounded-full blur-[160px] opacity-25 animate-float-reverse"
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/50 rounded-full blur-[200px] opacity-15 animate-drift"
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
