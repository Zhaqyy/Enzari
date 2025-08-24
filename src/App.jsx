import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";

import gsap from "gsap";

import Router from "./Routes/Router";

const App = () => {
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  });

  return (
    <>
      <ReactLenis
        root
        ref={lenisRef}
        autoRaf={false}
        options={{
          // orientation: "horizontal",
          //  gestureOrientataion: "both",
          duration: 1.6,
          syncTouch: true,
          touchMultiplier: 0,
        }}
      >
 
        <Router />
      </ReactLenis>
    </>
  );
};

export default App;
