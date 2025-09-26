import React, { useEffect, useRef } from 'react';

// Hook for Vanta.js effects - use this for targeted elements
const useVanta = ({ 
  backgroundColor = 0x13131a,
  color = 0x3f6212,
  spacing = 20,
  chaos = 4,
  minHeight = 200,
  minWidth = 200,
  scale = 1,
  scaleMobile = 1,
  mouseControls = true,
  touchControls = true,
  gyroControls = false
} = {}) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    // Load p5.js and Vanta.js scripts dynamically
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // Load p5.js first, then Vanta TRUNK
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.trunk.min.js');
        
        // Small delay to ensure scripts are fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize Vanta effect
        if (window.VANTA && window.VANTA.TRUNK && vantaRef.current) {
          vantaEffect.current = window.VANTA.TRUNK({
            el: vantaRef.current,
            mouseControls,
            touchControls,
            gyroControls,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            backgroundColor,
            color,
            spacing,
            chaos
          });
        }
      } catch (error) {
        console.error('Failed to load Vanta.js:', error);
      }
    };

    initVanta();

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          console.warn('Error destroying Vanta effect:', error);
        }
      }
    };
  }, [backgroundColor, color, spacing, chaos, minHeight, minWidth, scale, scaleMobile, mouseControls, touchControls, gyroControls]);

  return vantaRef;
};

// Component wrapper - use this when you need a full wrapper component
const VantaBackground = ({ 
  children,
  backgroundColor = 0x13131a,
  color = 0x3f6212,
  spacing = 0,
  chaos = 0.5,
  minHeight = 200,
  minWidth = 200,
  scale = 1,
  scaleMobile = 1,
  mouseControls = true,
  touchControls = true,
  gyroControls = false
}) => {
  const vantaRef = useVanta({
    backgroundColor,
    color,
    spacing,
    chaos,
    minHeight,
    minWidth,
    scale,
    scaleMobile,
    mouseControls,
    touchControls,
    gyroControls
  });

  return (
    <div 
      ref={vantaRef} 
      className="relative w-full min-h-screen"
      style={{ 
        backgroundColor: `#${backgroundColor.toString(16).padStart(6, '0')}` 
      }}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;
export { useVanta };