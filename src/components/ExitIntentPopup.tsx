import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ExitIntentPopupProps {
  currentStep?: string;
}

const ExitIntentPopup = ({ currentStep = 'email' }: ExitIntentPopupProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Solo activar en los pasos 'email' y 'details'
  const shouldBeActive = currentStep === 'email' || currentStep === 'details';

  useEffect(() => {
    // Solo en desktop (no mobile)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;
    
    // Solo activar en los primeros 2 pasos
    if (!shouldBeActive) return;

    let hasEnteredCentralZone = false;
    let lastMouseY = window.innerHeight / 2; // Empezar desde el centro
    let mouseMoveCount = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      mouseMoveCount++;
      
      // Ignorar los primeros movimientos para evitar falsos positivos al cargar
      if (mouseMoveCount < 3) {
        lastMouseY = currentY;
        return;
      }
      
      // Definir zona central más amplia
      const horizontalMargin = windowWidth * 0.15; // 15% a cada lado
      const verticalMargin = windowHeight * 0.15; // 15% arriba y abajo
      
      const centralZone = {
        left: horizontalMargin,
        right: windowWidth - horizontalMargin,
        top: verticalMargin,
        bottom: windowHeight - verticalMargin
      };
      
      // Verificar si está dentro de la zona central
      const isInsideCentralZone = 
        currentX >= centralZone.left &&
        currentX <= centralZone.right &&
        currentY >= centralZone.top &&
        currentY <= centralZone.bottom;
      
      // Marcar que el usuario entró en la zona central
      if (isInsideCentralZone) {
        hasEnteredCentralZone = true;
      }
      
      // Si no ha entrado a la zona central, no hacer nada
      if (!hasEnteredCentralZone) {
        lastMouseY = currentY;
        return;
      }
      
      // Si el popup ya está mostrado, no hacer nada
      if (showPopup) {
        lastMouseY = currentY;
        return;
      }
      
      // ZONAS DE ACTIVACIÓN - Donde se debe triggerar el popup
      const exitZoneTop = 60; // Primeros 60px desde arriba
      const cornerWidth = 150; // 150px de ancho para esquinas
      const cornerHeight = 120; // 120px de alto para esquinas
      
      // Borde superior completo
      const isInTopBorder = currentY <= exitZoneTop;
      
      // Esquina superior izquierda
      const isInTopLeftCorner = currentX <= cornerWidth && currentY <= cornerHeight;
      
      // Esquina superior derecha
      const isInTopRightCorner = currentX >= (windowWidth - cornerWidth) && currentY <= cornerHeight;
      
      // Está en alguna zona de activación
      const isInExitZone = isInTopBorder || isInTopLeftCorner || isInTopRightCorner;
      
      // Detectar movimiento hacia arriba (currentY menor que antes)
      const isMovingUp = currentY < lastMouseY - 2; // Con threshold de 2px para evitar micro-movimientos
      
      // TRIGGER: Usuario entró a zona central + está en zona de exit + se mueve hacia arriba
      if (isInExitZone && isMovingUp) {
        setPopupPosition({ x: currentX, y: currentY });
        setShowPopup(true);
        console.log('Exit intent triggered:', { currentX, currentY, zone: isInTopRightCorner ? 'right' : isInTopLeftCorner ? 'left' : 'top' });
      }
      
      lastMouseY = currentY;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Solo detectar si sale por arriba
      if (!hasEnteredCentralZone || showPopup) return;
      
      if (e.clientY <= 0) {
        setPopupPosition({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
        setShowPopup(true);
        console.log('Exit intent triggered: mouse leave');
      }
    };

    // Añadir listeners con passive: false para mejor performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showPopup, shouldBeActive]);

  const handleClose = () => {
    setShowPopup(false);
    // NO guardamos en sessionStorage para permitir que vuelva a salir
  };

  const handleStay = () => {
    setShowPopup(false);
    
    // Mostrar feedback minimalista
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
    
    // Scroll suave al formulario
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // NO guardamos en sessionStorage para permitir que vuelva a salir
  };

  const handleLeave = () => {
    // Redirigir a Google (hace que el usuario salga de la página)
    window.location.href = 'https://www.google.com';
  };

  // Feedback minimalista al quedarse
  const feedbackElement = showFeedback && (
    <div className="fixed top-8 left-1/2 z-[101] animate-feedbackSlide">
      <div className="px-6 py-3 rounded-full bg-[#1a1a1a]/95 backdrop-blur-[40px] border border-primary/30 shadow-[0_8px_32px_rgba(255,214,10,0.3)] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm text-white/90 font-medium">Perfecto, sigamos 👇</span>
      </div>
    </div>
  );

  if (!showPopup && !showFeedback) return null;
  if (showFeedback && !showPopup) return feedbackElement;

  // Calcular posición del popup cerca de donde salió el mouse
  // Ajustar para que no se salga de la pantalla
  const calculatePopupStyle = () => {
    const popupWidth = 400; // Ancho aproximado del popup
    const popupHeight = 400; // Alto aproximado del popup
    const padding = 20;
    
    let left = popupPosition.x - popupWidth / 2;
    let top = popupPosition.y - popupHeight / 2;
    
    // Ajustar si se sale por la izquierda
    if (left < padding) left = padding;
    // Ajustar si se sale por la derecha
    if (left + popupWidth > window.innerWidth - padding) {
      left = window.innerWidth - popupWidth - padding;
    }
    // Ajustar si se sale por arriba
    if (top < padding) top = padding;
    // Ajustar si se sale por abajo
    if (top + popupHeight > window.innerHeight - padding) {
      top = window.innerHeight - popupHeight - padding;
    }
    
    return { left: `${left}px`, top: `${top}px` };
  };

  return (
    <>
      {feedbackElement}
      <div className="fixed inset-0 z-[100]">
        {/* Backdrop con desenfoque gaussiano más suave - fade in separado */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-[16px] animate-exitPopupFade"
          style={{ WebkitBackdropFilter: 'blur(16px)' }}
          onClick={handleClose}
        />
      
      {/* Modal - Premium glassmorphism menos transparente + posicionado */}
      <div 
        className="absolute max-w-[380px] w-[90vw] bg-[#1a1a1a]/95 backdrop-blur-[40px] rounded-[32px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_0_80px_rgba(255,255,255,0.03)] p-8 animate-exitPopupScale"
        style={calculatePopupStyle()}
      >
        {/* Botón cerrar - más sutil y premium */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.1] hover:bg-white/[0.15] backdrop-blur-xl flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white/90 border border-white/20"
          aria-label="Cerrar"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>

        {/* Emoji con glow sutil */}
        <div className="text-5xl text-center mb-4 animate-pulse" style={{ animationDuration: '3s' }}>
          ⚡
        </div>

        {/* Headline - Typography premium más compacto */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3 leading-[1.2] text-white tracking-tight">
          ¿En serio vas a seguir igual?
        </h2>

        {/* Subheadline */}
        <p className="text-[15px] text-white/70 text-center mb-7 leading-relaxed font-normal">
          Llegaste hasta aquí. Eso significa algo.<br/>
          No dejes que la duda te detenga.
        </p>

        {/* Botones - Estilo Apple premium más compactos */}
        <div className="flex flex-col gap-2.5">
          {/* Botón primario - CTA fuerte */}
          <button
            onClick={handleStay}
            className="group relative w-full px-6 py-3.5 rounded-[24px] bg-gradient-to-b from-[#FFD60A] to-[#FFCC00] text-black font-semibold text-[15px] hover:shadow-[0_0_40px_rgba(255,214,10,0.5),0_8px_24px_rgba(255,214,10,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <span className="relative">Tienes razón, continúo</span>
          </button>
          
          {/* Botón secundario - Glassmorphism sutil */}
          <button
            onClick={handleLeave}
            className="w-full px-6 py-3 rounded-[20px] bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 text-white/60 hover:text-white/80 transition-all duration-300 text-[14px] font-medium backdrop-blur-xl"
          >
            No estoy seguro
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default ExitIntentPopup;
