import React, { useEffect, useRef, useState } from "react";
import "../Style/Home.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import useIsMobile from "../Util/isMobile";

// Register SplitText plugin
gsap.registerPlugin(SplitText);

function Oto() {
  const homeRef = useRef();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPalette, setCurrentPalette] = useState(0);
  const isMobile = useIsMobile();

  // Configuration - Easy to modify
  const CONFIG = {
    // Minimum width of each pane in pixels
    // Panes will stretch to fill the screen width perfectly
    paneWidth: isMobile ? 60 : 90, // Minimum width of each pane in pixels
    // Number of special day panes (will be attached to the last panes)
    numSpecialDays: 4
  };


  // Multiple color palettes for dynamic transitions
  // To adjust saturation of any color, use: adjustSaturation('rgb(r,g,b)', factor)
  // Example: adjustSaturation('rgb(175, 215, 225)', 1.15) for 15% more saturation
  const colorPalettes = [
    // Warm pastel palette - improved saturation
    [
      'rgb(190, 115, 85)', 
      'rgb(235, 205, 175)',
      'rgb(230, 195, 165)',
      'rgb(240, 225, 215)',
      'rgb(200, 135, 105)',
      'rgb(225, 185, 155)',
      'rgb(210, 155, 125)',
      'rgb(195, 125, 95)', 
      'rgb(220, 175, 145)',
      'rgb(205, 145, 115)',
      'rgb(215, 165, 135)',
      'rgb(185, 105, 75)'  
    ],
    // Purple pastel palette - improved saturation
    [
      'rgb(225, 195, 230)',
      'rgb(215, 175, 220)',
      'rgb(190, 125, 195)',
      'rgb(235, 215, 240)',
      'rgb(185, 115, 190)',
      'rgb(220, 185, 225)',
      'rgb(195, 135, 200)',
      'rgb(210, 165, 215)',
      'rgb(200, 145, 205)',
      'rgb(205, 155, 210)',
      'rgb(230, 205, 235)',
      'rgb(180, 105, 185)' 
    ],
    // Green pastel palette - improved saturation
    [
      'rgb(135, 200, 145)',
      'rgb(205, 235, 215)',
      'rgb(215, 240, 225)',
      'rgb(125, 195, 135)',
      'rgb(195, 230, 205)',
      'rgb(155, 210, 165)',
      'rgb(165, 215, 175)',
      'rgb(175, 220, 185)',
      'rgb(115, 190, 125)',
      'rgb(145, 205, 155)',
      'rgb(185, 225, 195)',
      'rgb(105, 185, 115)' 
    ],
    [
      'rgb(175, 215, 225)',
      'rgb(195, 205, 225)',
      'rgb(205, 215, 230)',
      'rgb(165, 195, 215)',
      'rgb(145, 205, 215)',
      'rgb(185, 225, 235)',
      'rgb(215, 235, 240)',
      'rgb(185, 215, 230)',
      'rgb(195, 225, 240)',
      'rgb(155, 185, 205)',
      'rgb(175, 205, 220)',
      'rgb(165, 195, 210)' 
    ],
  ];

  // Dynamically calculate number of panes based on screen width and minimum pane width
  const calculateNumPanes = () => {
    const screenWidth = window.innerWidth;
    const minPaneWidth = CONFIG.paneWidth;
    // Calculate how many panes can fit with minimum width
    // This ensures panes will stretch to fill the screen perfectly
    return Math.max(1, Math.floor(screenWidth / minPaneWidth));
  };

  const [NUM_PANES, setNUM_PANES] = useState(calculateNumPanes());

  // Optionally, map special days to the last few panes
  const specialDays = [
    { day: 'FRIDAY' },
    { day: 'SATURDAY' },
    { day: 'SUNDAY' },
    { day: 'TICKETS' }
  ].slice(0, CONFIG.numSpecialDays);

  const panes = Array.from({ length: NUM_PANES }, (_, i) => {
    // Attach special day labels to the last panes
    const specialIndex = NUM_PANES - specialDays.length;
    if (i >= specialIndex) {
      return { id: i + 1, ...specialDays[i - specialIndex] };
    }
    return { id: i + 1 };
  });

  // Store animation timelines and states for gradient completion
  const gradientTimelines = useRef({});
  const gradientStates = useRef({}); // Track if gradient is flowing up or down

  const { contextSafe } = useGSAP({ scope: homeRef });

  useEffect(() => {
    // Set CSS custom properties for dynamic grid
    document.documentElement.style.setProperty('--pane-width', `${CONFIG.paneWidth}px`);
    document.documentElement.style.setProperty('--num-panes', NUM_PANES);
    
    const context = gsap.context(() => {
      const tl = gsap.timeline();
      // Initial animation for panes
      tl.fromTo('.pane', 
        { 
          scaleY: 0,
          opacity: 0 
        },
        { 
          scaleY: 1,
          opacity: 1,
          duration: 1,
          stagger: {
            each: 0.1,
            from: 'random',
            grid: 'auto',
          },
          ease: "expo.out"
        }
      );

      // SplitText animation for main title - wait for fonts to load
      const initSplitText = () => {
        // Always split by chars, but animate only words on mobile for responsiveness
        const split = SplitText.create(".main-title", {
          type: "words,chars"
        });

        if (isMobile) {
          // Animate words on mobile
          tl.from(split.words, {
            duration: 1,
            y: 100,
            autoAlpha: 0,
            stagger: 0.08,
            ease: "power2.out"
          }, '-=1.5');
        } else {
          // Animate chars on desktop
          tl.from(split.chars, {
            duration: 1,
            y: 100,
            autoAlpha: 0,
            stagger: 0.05,
            ease: "power2.out"
          }, '-=1.5');
        }
      };

      // Check if fonts are loaded, if not wait for them
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          initSplitText();
        });
      } else {
        // Fallback for browsers that don't support document.fonts
        setTimeout(initSplitText, 100);
      }

      // Animate play button
      tl.fromTo('.play-button', 
        { 
          // scale: 0,
          opacity: 0 ,
          y: 20
        },
        { 
          // scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        },
        '>'
      );

    }, homeRef);

    return () => context.revert();
  }, [CONFIG.paneWidth, NUM_PANES]);

  // Handle window resize to recalculate number of panes
  useEffect(() => {
    const handleResize = () => {
      setNUM_PANES(calculateNumPanes());
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const handlePaneInteraction = (paneRef, isEntering) => {
    const gradientElement = paneRef.querySelector('.pane-gradient');
    const paneId = paneRef.dataset.paneId;
    
    // Initialize state for this pane if not exists
    if (!gradientStates.current[paneId]) {
      gradientStates.current[paneId] = { isFlowingUp: false, isFlowingDown: false };
    }
    
    const state = gradientStates.current[paneId];
    
    if (isEntering && !state.isFlowingUp) {
      // Start flowing up
      state.isFlowingUp = true;
      state.isFlowingDown = false;
      
      // Add active class for scale effect
      paneRef.classList.add('active');
      
      gsap.to(gradientElement, {
        y: '0%',
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => {
          state.isFlowingUp = false;
          // Check if still interacting
          if (paneRef.classList.contains('touching') || paneRef.classList.contains('hovering')) {
            // Stay at top
          } else {
            // Start flowing back down
            state.isFlowingDown = true;
            gsap.to(gradientElement, {
              y: '100%',
              duration: 1,
              ease: "expo.in",
              onComplete: () => {
                state.isFlowingDown = false;
              }
            });
            // Remove active class
            paneRef.classList.remove('active');
          }
        }
      });
    } else if (!isEntering && !state.isFlowingDown && state.isFlowingUp) {
      // If we stop interacting while flowing up, let it complete then flow down
      // The onComplete callback above will handle this
    } else if (!isEntering && !state.isFlowingUp && !state.isFlowingDown) {
      // If we're at the top and stop interacting, flow down
      state.isFlowingDown = true;
      gsap.to(gradientElement, {
        y: '100%',
        duration: 0.25,
        ease: "expo.in",
        onComplete: () => {
          state.isFlowingDown = false;
        }
      });
      // Remove active class
      paneRef.classList.remove('active');
    }
  };

  const changeColorPalette = () => {
    const nextPalette = (currentPalette + 1) % colorPalettes.length;
    
    // First, set the new palette state immediately to prevent flicker
    setCurrentPalette(nextPalette);
    
    // Then animate the color transition with stagger from center
    gsap.to('.pane', {
      backgroundColor: (i) => colorPalettes[nextPalette][i % colorPalettes[nextPalette].length],
      duration: 0.5,
      stagger: {
        each: 0.1,
        from: 'center',
        grid: 'auto',
      },
      ease: "power2.inOut",
      onStart: () => {
        // Update state after animation starts for smoother transition
        setCurrentPalette(nextPalette);
      }
    });
  };

  return (
    <section className='festival-hero' ref={homeRef}>
      {/* Background Panes */}
      <div className="background-panes">
        {panes.map((pane, index) => (
          <div
            key={pane.id}
            className="pane"
            data-pane-id={pane.id}
            style={{ 
              backgroundColor: colorPalettes[currentPalette][index % colorPalettes[currentPalette].length] 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.classList.add('hovering');
              handlePaneInteraction(e.currentTarget, true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.remove('hovering');
              handlePaneInteraction(e.currentTarget, false);
            }}
            onTouchStart={(e) => {
              e.currentTarget.classList.add('touching');
              handlePaneInteraction(e.currentTarget, true);
            }}
            onTouchEnd={(e) => {
              e.currentTarget.classList.remove('touching');
              handlePaneInteraction(e.currentTarget, false);
            }}
            onTouchMove={(e) => {
              // Prevent default to avoid scrolling
              e.preventDefault();
              // Find which pane we're currently touching
              const touch = e.touches[0];
              const element = document.elementFromPoint(touch.clientX, touch.clientY);
              const pane = element?.closest('.pane');
              if (pane) {
                // Remove touching class from all panes
                document.querySelectorAll('.pane').forEach(p => p.classList.remove('touching'));
                // Add touching class to current pane
                pane.classList.add('touching');
                handlePaneInteraction(pane, true);
              }
            }}
            onClick={changeColorPalette}
          >
            {/* Gradient overlay for animation */}
            <div className="pane-gradient"></div>
            
            {/* Day label if this pane has one */}
            {pane.day && (
              <div className="pane-day">
                {pane.day}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="navigation">
        <a href="/" className="nav-item home-link">HOME</a>
      </nav>



      {/* Main Title */}
      <h1 className="main-title">ENZARI STUDIOS</h1>

      {/* Play Sound Button */}
      <a href="https://otonove.studiokhi.com/" target="_blank" rel="noopener noreferrer"
        className="play-button"
      >
        <span className="play-text">ORIGINAL SITE</span>
      </a>
    </section>
  );
}

export default Oto; 