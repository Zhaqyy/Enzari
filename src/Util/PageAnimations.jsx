import gsap from "gsap";

/*--------------------
  About Page Animation
  --------------------*/
export const animateAbtElements = abtRef => {
  const tl = gsap.timeline();

  // Staggered clipPath animation for h1 elements
  tl.fromTo(
    abtRef.current.querySelectorAll(".abtTitle h1"),
    { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha: 1,
      duration: 1.5,
      stagger: 0.5,
      ease: "expo.out",
    }
  );

  // ClipPath animation for h5 (from left to right)
  tl.fromTo(
    abtRef.current.querySelector(".abtTitle h5"),
    { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.in",
    },
    "-=1.25" // Overlap with the stagger animation
  );

  // Fade-in animation for paragraph
  tl.fromTo(
    abtRef.current.querySelector(".abtInfo .infoSlider"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "expo.out",
    },
    "-=0.5"
  );
  // Fade-in animation for paragraph
  tl.fromTo(
    abtRef.current.querySelector(".abtHeader p"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "expo.out",
    },
    "<"
  );

  return tl;
};

export const animateAbtCanvas = abtRef => {
  const tl = gsap.timeline({
    defaults: {
      ease: "expo.out",
      duration: 1.5,
    },
  });

  tl.fromTo(
    ".canv",
    { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha: 1,
    }
  );

  tl.fromTo(
    ".type",
    {
      // x: -5,
      autoAlpha: 0,
    },
    {
      // x: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "sine.in",
    },
    ">"
  );

  tl.fromTo(
    ".Lword",
    {
      y: 5,
      autoAlpha: 0,
    },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "sine.in",
    },
    "<"
  );

  tl.fromTo(
    ".Rword",
    {
      y: -5,
      autoAlpha: 0,
    },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "sine.in",
    },
    "<"
  );

  tl.fromTo(
    ".type-word",
    {
      filter: "blur(2px)",
      autoAlpha: 0,
    },
    {
      filter: "blur(0px)",
      autoAlpha: 1,
      duration: 0.5,
      ease: "sine.in",
    },
    "<"
  );
  tl.fromTo(
    ".canvPrev",
    {
      x: -10,
      autoAlpha: 0,
    },
    {
      x: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "elastic.out(0.5, 0.25)",
    },
    "+=0.25"
  );
  tl.fromTo(
    ".canvNext",
    {
      x: 10,
      autoAlpha: 0,
    },
    {
      x: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "elastic.out(0.5, 0.25)",
    },
    "<"
  );

  tl.fromTo(
    ".sceneInfo",
    { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
    },
    "-=0.5"
  );

  return tl;
};

/*--------------------
  Project Page Animation
  --------------------*/

export const animateWork = workRef => {
  const tl = gsap.timeline();

  // ClipPath animation for h5 (from left to right)
  tl.fromTo(
    workRef.current.querySelector(".work .title h6"),
    { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.in",
    }
  );

  // Staggered clipPath animation for h1 elements
  tl.fromTo(
    workRef.current.querySelectorAll(".work .title h1"),
    { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha: 1,
      duration: 1.5,
      stagger: 0.5,
      ease: "expo.out",
    },
    "+=0.25"
  );

  // Fade-in animation for paragraph
  tl.fromTo(
    workRef.current.querySelectorAll(".work .detail .desc p,.work .detail .desc ul "),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 1.5,
      stagger: 0.15,
      ease: "expo.out",
    },
    "<"
  );

  tl.fromTo(
    workRef.current.querySelector(".work .serviceList"),
    { autoAlpha: 0, y: 10 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.5,
      ease: "expo.out",
    },
    "<"
  );
  tl.fromTo(
    workRef.current.querySelector(".work .stack"),
    { autoAlpha: 0, y: 10 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.5,
      ease: "expo.out",
    },
    "<"
  );

  tl.fromTo(
    workRef.current.querySelector(".work .liveBtn"),
    { autoAlpha: 0, y: 10, rotate: 5 },
    {
      autoAlpha: 1,
      y: 0,
      rotate: 0,
      duration: 1.5,
      ease: "expo.out",
    },
    "-=1"
  );

  return tl;
};

export const animateImageIn = imageWrapRefs => {
  const tl = gsap.timeline({
    defaults: {
      ease: "power1.out",
      duration: 0.5,
    },
  });

  imageWrapRefs.current.forEach((imageWrap, index) => {
    tl.fromTo(
      imageWrap,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      }
    );
  });

  return tl;
};

export const animateImage = imageWrapRefs => {
  const tl = gsap.timeline({
    defaults: {
      ease: "sine.in",
    },
  });

  imageWrapRefs.current.forEach((imageWrap, index) => {
    // console.log(imageWrap);
    tl.to(imageWrap, {
      "--opac": 0,
      "duration": 0.35,
    }).fromTo(
      imageWrap.querySelector(".media-slide"),
      {
        filter: "blur(2px)",
        // filter: "grayscale(100%)",
      },
      {
        filter: "blur(0px)",
        // filter: "grayscale(0%)",
        duration: 0.5,
      },
      "<"
    );
  });

  return tl;
};

/*--------------------
  Home Page Animation
  --------------------*/

export const animateHome = homeRef => {
  const tl = gsap.timeline();

  // Staggered clipPath animation for h1 elements
  tl.fromTo(
    homeRef.current.querySelector(".main-hero .name h1"),
    { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha: 1,
      duration: 1.5,
      ease: "expo.in",
    }
  );
  tl.fromTo(
    homeRef.current.querySelector(".main-hero .name h2"),
    { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha: 1,
      duration: 1.5,
      ease: "expo.in",
    },
    "-=1"
  );

  tl.fromTo(
    homeRef.current.querySelector(".main-hero .project h3"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.out",
    },
    ">"
  );

  tl.fromTo(
    homeRef.current.querySelectorAll(".main-hero .project li"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      stagger: 0.25,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );
  tl.fromTo(
    homeRef.current.querySelector(".main-hero .detail h5"),
    { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );
  tl.fromTo(
    homeRef.current.querySelectorAll(".titleMobile"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );
  tl.fromTo(
    homeRef.current.querySelectorAll(".titleMobile .titlePrev"),
    {
      x: -10,
      autoAlpha: 0,
    },
    {
      x: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "elastic.out(0.5, 0.25)",
    },
    ">"
  );
  tl.fromTo(
    homeRef.current.querySelectorAll(".titleMobile .titleNext"),
    {
      x: 10,
      autoAlpha: 0,
    },
    {
      x: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "elastic.out(0.5, 0.25)",
    },
    "<"
  );

  return tl;
};
export const animateHomeFoot = containerRef => {
  const tl = gsap.timeline();

  tl.fromTo(
    containerRef.current.querySelector(".sound"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.out",
    }
  );

  tl.fromTo(
    containerRef.current.querySelectorAll(".bCrumb li"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      stagger: 0.25,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );

  tl.fromTo(
    containerRef.current.querySelectorAll(".contact li"),
    { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      stagger: 0.25,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );

  return tl;
};

/*--------------------
  Header Animation
  --------------------*/

export const animateHeader = headerRef => {
  const tl = gsap.timeline();

  tl.set(headerRef.current, { autoAlpha: 1 });
  return tl;
};
export const animateNav = navRef => {
  const tl = gsap.timeline();

  // Animate Logo parts
  tl.fromTo(navRef.current, { y: "-100%", autoAlpha: 0 }, { y: "0%", autoAlpha: 1, duration: 1, ease: "power2.in" });
  return tl;
};

//logo intro
export const animateLogoIntro = logoRef => {
  const tl = gsap.timeline();

  // Animate Logo parts
  tl.set(logoRef.current, { width: 30, height: 30 })
    .to(logoRef.current, { opacity: 1, duration: 0.5, ease: "power3.in" })
    .fromTo("#bow1", { strokeDasharray: "500", strokeDashoffset: "500" }, { strokeDashoffset: "0", duration: 2, ease: "sine.in" }, "+=0.5")
    .fromTo("#bow2", { strokeDasharray: "500", strokeDashoffset: "500" }, { strokeDashoffset: "0", duration: 2, ease: "sine.in" }, "<")
    .fromTo("#dot1", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
    .fromTo("#dot2", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 1, ease: "back.out(1.7)" }, "<");
  return tl;
};

// to rot or not to rot
export const animateLogoRot1 = headerRef => {
  const tl = gsap.timeline({
    onComplete: () => {
      tl.set(headerRef.current, {
        pointerEvents: "auto",
        delay: 1,
      });
    },
  });


  tl.to(
    "#logo",
    {
      rotate:0,duration: 0.25, ease: "elastic.out(.5)"
    }
  )

  return tl;
};
export const animateLogoRot2 = headerRef => {
  const tl = gsap.timeline({
    onComplete: () => {
      tl.set(headerRef.current, {
        pointerEvents: "auto",
        delay: 1,
      });
    },
  });


  tl.to(
    "#logo",
    {
      rotate:90,duration: 0.25, ease: "elastic.out(.5)"
    }
  )

  return tl;
};

// bow animation types
export const animateLogo1 = headerRef => {
  const tl = gsap.timeline();

  // Animate Logo parts

  tl.fromTo("#bow1", { y: "0%" }, { y: "-100%", duration: 0.5, ease: "elastic.out(.5)" }, "+=0.5").fromTo(
    "#bow2",
    { y: "0%" },
    { y: "100%", duration: 0.5, ease: "elastic.out(.5)" },
    "<"
  );

  return tl;
};
export const animateLogo2 = headerRef => {
  const tl = gsap.timeline();

  // Animate Logo parts

  tl.fromTo(
    "#bow1", 
  { y: "0%" }, 
  { y: "-100%",x: "50%", duration: 0.5, ease: "elastic.out(.5)" },
   "+=0.5")
   
   .fromTo(
    "#bow2",
    { y: "0%" },
    { y: "100%",x: "-50%", duration: 0.5, ease: "elastic.out(.5)" },
    "<"
  );

  return tl;
};
export const animateLogo3 = headerRef => {
  const tl = gsap.timeline();

  // Animate Logo parts

  tl.fromTo(
    "#bow1", 
  { y: "0%" }, 
  { y: "-100%",x: "-50%", duration: 0.5, ease: "elastic.out(.5)" },
   "+=0.5")
   
   .fromTo(
    "#bow2",
    { y: "0%" },
    { y: "100%",x: "50%", duration: 0.5, ease: "elastic.out(.5)" },
    "<"
  );

  return tl;
};
export const animateLogo4 = headerRef => {
  const tl = gsap.timeline();

  // Animate Logo parts

  tl.fromTo(
    "#bow1", 
  { y: "0%" }, 
  { y: "50%", duration: 0.5, ease: "elastic.out(.5)" },
   "+=0.5")
   
   .fromTo(
    "#bow2",
    { y: "0%" },
    { y: "-50%", duration: 0.5, ease: "elastic.out(.5)" },
    "<"
  );

  return tl;
};
export const animateLogo5 = headerRef => {
  const tl = gsap.timeline();

  // Animate Logo parts

  tl.fromTo(
    "#bow1", 
  { y: "0%" }, 
  { y: "100%", duration: 0.5, ease: "elastic.out(.5)" },
   "+=0.5")
   
   .fromTo(
    "#bow2",
    { y: "0%" },
    { y: "-100%", duration: 0.5, ease: "elastic.out(.5)" },
    "<"
  );

  return tl;
};
export const animateLogoDot = logoRef => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, yoyo: true });

  // Animate Logo parts 2
  tl.to("#dot1", { y: "-100%", duration: 1, ease: "elastic.inOut(.75)" })
    .to("#dot2", { y: "100%", duration: 1, ease: "elastic.inOut(.75)" }, "<")

    .to("#dot1", { x: "100%", duration: 1, ease: "elastic.inOut(.75)" }, ">")
    .to("#dot2", { x: "-100%", duration: 1, ease: "elastic.inOut(.75)" }, "<")

    .to("#dot1", { y: "50%", duration: 1, ease: "elastic.inOut(.5)" }, ">")
    .to("#dot2", { y: "-50%", duration: 1, ease: "elastic.inOut(.5)" }, "<")

    .to("#dot1", { x: "-100%", duration: 1.5, ease: "elastic.out(.5)" }, ">")
    .to("#dot2", { x: "100%", duration: 1.5, ease: "elastic.out(.5)" }, "<");

  return tl;
};
export const animateBars = logoRef => {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    "#bow1",
    {
      attr: { d: "M2.58,35.07C.49,24.17,38.48,3.18,75.76,2.52c39.57-.7,78.92,21.5,76.83,32.56" },
    },
    {
      attr: {
        d: "M 10 2.52 L 46.66666666666667 2.52 L 73.33333333333334 2.52 L 100 2.52 L 126.66666666666667 2.52 L 153.33333333333334 2.52 L 180 2.52",
      },
      duration: 0.25,
      ease: "expo.out",
    }
  );
  tl.fromTo(
    "#bow2",
    {
      attr: { d: "M152.58,24.91c2.09,10.91-35.9,31.9-73.17,32.56C39.84,58.17.49,35.98,2.58,24.91" },
    },
    {
      attr: {
        d: "M 10 58.17 L 46.66666666666667 58.17 L 73.33333333333334 58.17 L 100 58.17 L 126.66666666666667 58.17 L 153.33333333333334 58.17 L 180 58.17",
      },
      duration: 0.25,
      ease: "expo.out",
    },
    "<"
  );

  return tl;
};
