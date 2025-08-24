import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";
import useIsMobile from "../Util/isMobile";

const Cursor = () => {
  const ref = useRef();
  const [isMoving, setIsMoving] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile(800);

  // Routes where specific style shouldn't apply
  const excludedRoutes = ["/"];
  useEffect(() => {
    const isExcluded = excludedRoutes.includes(location.pathname);
    // if (ref.current) return;
    // gsap.set(ref.current, {
    //   xPercent: -50,
    //   yPercent: -50,
    // });
    // gsap.set(ref.current, { x: -100, y: -100, xPercent: -50, yPercent: -50 });
    // start from center
    gsap.set(ref.current, { x: window.innerWidth / 2, y: window.innerHeight / 2, xPercent: -50, yPercent: -50 });

    gsap.to(ref.current, {
      scale: isExcluded ? 1 : 0.25,
      strokeWidth: isExcluded ? 1 : 5,
      duration: 0.5,
      ease: "expo.inOut",
      delay: 1.5,
    });

    if (isMobile & !isExcluded) {
      gsap.set(ref.current, {
        display: "none",
      });
    } else {
      gsap.set(ref.current, {
        display: "block",
      });
    }

    // Setup the gsap quickTo for smooth movement
    const xTo = gsap.quickTo(ref.current, "x", { duration: 1, ease: "power3" });
    const yTo = gsap.quickTo(ref.current, "y", { duration: 1, ease: "power3" });

    let distance = 0;
    let mouseX = 0;
    let mouseY = 0;

    // const calculateDistance = () => {
    //   const lottieX = gsap.getProperty(ref.current, "x");
    //   const lottieY = gsap.getProperty(ref.current, "y");
    //   distance = Math.sqrt(Math.pow(mouseX - lottieX, 2) + Math.pow(mouseY - lottieY, 2));
    // };

    const handleMouseMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Calculate distance and rotation on each mouse move
      //   calculateDistance();

      // Compute direction for rotation (flipping on Y axis)
      const dx = mouseX - gsap.getProperty(ref.current, "x");
      const dy = mouseY - gsap.getProperty(ref.current, "y");

      const rotationY = dx < 0 ? 180 : 0;
      const rotationZ = Math.atan2(dy, Math.abs(dx)) * (45 / Math.PI) * (rotationY === 180 ? -1 : 1);

      gsap.to(ref.current, { rotationY, rotationZ, duration: 1.5, ease: "power3" });

      // Move the duck if beyond the proximity distance
      //   if (distance > 50) {
      //     if (!isMoving) {
      //       setIsMoving(true);
      //     }
      xTo(mouseX);
      yTo(mouseY);
      //   }
    };

    // const ticker = gsap.ticker.add(() => {
    //   calculateDistance(); // Update distance on every tick

    //   if (distance < 50 && isMoving) {
    //     setIsMoving(false);
    //   }
    // });

    // Attach mousemove event listener
    window.addEventListener("pointermove", handleMouseMove);

    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      //   gsap.ticker.remove(ticker);
    };
  }, [location.pathname]); // Re-run effect when location changes

  return (
    <div
      ref={ref}
      style={{
        height: 150,
        width: 250,
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        zIndex: 69,
        mixBlendMode: "difference",
      }}
    >
      <svg id='target' xmlns='http://www.w3.org/2000/svg'>
        <g id='center'>
          <line x1='125.15' y1='.5' x2='125.15' y2='149.65' fill='none' stroke='#fff' strokeLinecap='round' strokeLinejoin='round' />
          <rect x='122.88' y='.15' width='4.55' height='.7' strokeWidth='0' fill='#fff' />
          <rect x='121.9' y='149.15' width='6.5' height='1' strokeWidth='0' fill='#fff' />
          <line x1='249.8' y1='75.15' x2='.65' y2='75.15' fill='none' stroke='#fff' strokeLinecap='round' strokeLinejoin='round' />
          <rect x='249.45' y='72.88' width='.7' height='4.55' strokeWidth='0' fill='#fff' />
          <rect x='.15' y='71.9' width='1' height='6.5' strokeWidth='0' fill='#fff' />
        </g>
      </svg>
    </div>
  );
};

export default Cursor;
