import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import "../Style/Component.scss";

// Ambient sounds setup
const ambientSound = new Howl({ src: ["/Sounds/homeAmb.mp3"], loop: true, volume: 0 });

// Interaction sounds setup
const interactionSounds = {
  hover: {
    reverbed: [new Howl({ src: ["/Sounds/popH.mp3"], volume: 0.0025 }), new Howl({ src: ["/Sounds/popH2.mp3"], volume: 0.005 })],
    normal: [
      new Howl({ src: ["/Sounds/hover1.mp3"], volume: 0.25, rate: 0.35 }),
      new Howl({ src: ["/Sounds/hover2.mp3"], volume: 0.25, rate: 0.35 }),
    ],
  },
  click: {
    reverbed: [
      new Howl({ src: ["/Sounds/clickH.mp3"], volume: 0.005 }),
      // new Howl({ src: ['/Sounds/click_reverbed2.mp3'], volume: 1 }),
    ],
    normal: [
      new Howl({ src: ["/Sounds/click.mp3"], volume: 0.25, rate: 3.5 }),
      // new Howl({ src: ['/Sounds/click_normal2.mp3'], volume: 1 }),
    ],
  },
};

const getRandomSound = soundsArray => {
  const randomIndex = Math.floor(Math.random() * soundsArray.length);
  return soundsArray[randomIndex];
};

export const useSoundEffects = isMenuOpen => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMuted = useRef(false);
  const currentAmbient = useRef(ambientSound);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inProximity, setInProximity] = useState(false);

  // Play the appropriate ambient sound regardless of toggle state
  // const playAmbientSound = () => {
  //   const targetVolume = isHome ? 0.025 : 0.015; // Lower volume for non-home pages
  //   if (!currentAmbient.current.playing()) {
  //     currentAmbient.current.play();
  //     currentAmbient.current.fade(0, targetVolume, 1000); // fade in smoothly
  //   } else {
  //     currentAmbient.current.fade(0, targetVolume, 1000);
  //   }
  // };
  const playAmbientSound = () => {
    if (!currentAmbient.current.playing()) {
      currentAmbient.current.play();
      const targetVolume = isHome ? 0.025 : 0.015;
      currentAmbient.current.fade(0, targetVolume, 1000); // Fade in smoothly
    }
  };

  // Mute or unmute all sounds, including interaction sounds
  const toggleMute = () => {
    isMuted.current = !isMuted.current;
    const targetVolume = isMuted.current ? 0 : 1;
    gsap.to(Howler, {
      volume: targetVolume,
      duration: 1,
      //   onComplete: () => Howler.mute(isMuted.current),
    });
  };

  // Adjust ambient playback rate based on menu state
  useEffect(() => {
    if (currentAmbient.current) {
      const targetRate = isMenuOpen ? 0.65 : 0.75;
      gsap.to(currentAmbient.current, { rate: targetRate, duration: 0.5 });
    }
  }, [isMenuOpen]);

  // Detect tab visibility and fade sound out when hidden
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && currentAmbient.current.playing()) {
      currentAmbient.current.fade(isHome ? 0.025 : 0.015, 0, 1000);
      setTimeout(() => currentAmbient.current.pause(), 1000);
    } else if (document.visibilityState === "visible" && !isMuted.current) {
      currentAmbient.current.play();
      currentAmbient.current.fade(0, isHome ? 0.025 : 0.015, 1000);
    }
  };

  //   add event to page and trigger ambient
  useEffect(() => {
    playAmbientSound();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isHome]);

  // Play interaction sound with ID-based exclusion/inclusion
  useEffect(() => {
    const playInteractionSound = e => {
      if (isMuted.current) return;

      const excludedIds = ["exclude", "exclude"];
      const includedIds = ["bCrumb", "ctrlBtn"];

      const target = e.target;
      const isButton = target instanceof Element && target.matches("button, a");
      const shouldPlaySound =
        isButton || (target instanceof Element && includedIds.includes(target.id) && !excludedIds.includes(target.id));

      if (shouldPlaySound) {
        const type = e.type === "mouseenter" ? "hover" : "click";
        const pageType = isHome ? "reverbed" : "normal";
        const sound = getRandomSound(interactionSounds[type][pageType]);
        sound.play();
      }
    };

    document.addEventListener("mouseenter", playInteractionSound, true);
    document.addEventListener("click", playInteractionSound, true);

    return () => {
      document.removeEventListener("mouseenter", playInteractionSound, true);
      document.removeEventListener("click", playInteractionSound, true);
    };
  }, [isHome]);

  //play sound for about page slides
  const playSlideSound = type => {
    if (!isMuted.current) {
      const pageType = isHome ? "reverbed" : "normal";
      const sound = getRandomSound(interactionSounds[type][pageType]);
      sound.play();
    }
  };

  // Fade out ambient sound and set transition flag
  const fadeOutSound = () => {
    setIsTransitioning(true);
    if (currentAmbient.current.playing()) {
      const volume = currentAmbient.current.volume();
      currentAmbient.current.fade(volume, 0, 1000);
      gsap.to(currentAmbient.current, { rate: 0.6, duration: 0.5 });
    }
  };

  // Fade in ambient sound post-transition, adjust based on page type
  const fadeInSound = () => {
    setIsTransitioning(false);
    const targetVolume = isHome ? 0.025 : 0.015;
    if (!currentAmbient.current.playing()) {
      currentAmbient.current.play();
      currentAmbient.current.fade(0, targetVolume, 1000);
    } else {
      gsap.to(currentAmbient.current, { volume: targetVolume, rate: 1, duration: 0.5 });
    }
  };

  // Update rate if in proximity and no transition
  const updateProximityRate = proximity => {
    if (!isTransitioning) {
      const targetRate = 0.75 + (1 - proximity) * 0.25;
      currentAmbient.current.rate(targetRate);
    }
  };

  return {
    toggleMute,
    playSlideSound,
    fadeOutSound,
    fadeInSound,
    updateProximityRate,
    setInProximity,
    currentAmbient,
  };
};



export const SoundCtrl = () => {
  const { toggleMute } = useSoundEffects();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (muted) {
      gsap.to('.sound span', { duration: 0.5, boxShadow: '1px 1px gray', ease: 'power1.in' });
    } else {
      gsap.to('.sound span', { duration: 0.5, boxShadow: '-1px -1px gray', ease: 'power1.in' });
    }
  }, [muted]);

  const handleMuteToggle = () => {
    setMuted(!muted);
    toggleMute();
  };

  return (
    <button onClick={handleMuteToggle} className='sound'>
      <span>
        <svg width='10px' height='8px' viewBox='0 0 10 8' version='1.1' xmlns='http://www.w3.org/2000/svg'>
          <g
            key={muted ? 'muted' : 'unmuted'} // Force React to re-render on state change
            id='Audio'
            transform='translate(0.000000, 0.500000)'
            stroke='var(--secAccent)'
            strokeWidth='1'
            fillRule='evenodd'
            strokeLinecap='round'
          >
            <line x1='8.5' y1='0.493135' x2='8.5' y2='6.50687' id='Line-5'>
              <animate
                attributeType='XML'
                attributeName='y1'
                values={muted ? '2;2' : '2;0;2'}
                keyTimes='0;0.5;1'
                dur='.8s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
              <animate
                attributeType='XML'
                attributeName='y2'
                values={muted ? '5;5' : '5;7;5'}
                keyTimes='0;0.5;1'
                dur='.8s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
            </line>
            <line x1='6.5' y1='0.789016' x2='6.5' y2='6.21098' id='Line-4'>
              <animate
                attributeType='XML'
                attributeName='y1'
                values={muted ? '0;0' : '0;2;0'}
                keyTimes='0;0.5;1'
                dur='.5s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
              <animate
                attributeType='XML'
                attributeName='y2'
                values={muted ? '7;7' : '7;5;7'}
                keyTimes='0;0.5;1'
                dur='.5s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
            </line>
            <line x1='4.5' y1='1.67582' x2='4.5' y2='5.32418' id='Line-3'>
              <animate
                attributeType='XML'
                attributeName='y1'
                values={muted ? '1;1' : '1;3;1'}
                keyTimes='0;0.5;1'
                dur='.6s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
              <animate
                attributeType='XML'
                attributeName='y2'
                values={muted ? '6;6' : '6;4;6'}
                keyTimes='0;0.5;1'
                dur='.6s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
            </line>
            <line x1='2.5' y1='1.14678' x2='2.5' y2='5.85322' id='Line-2'>
              <animate
                attributeType='XML'
                attributeName='y1'
                values={muted ? '2;2' : '2;1;2'}
                keyTimes='0;0.5;1'
                dur='.7s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
              <animate
                attributeType='XML'
                attributeName='y2'
                values={muted ? '5;5' : '5;6;5'}
                keyTimes='0;0.5;1'
                dur='.7s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
            </line>
            <line x1='0.5' y1='1.67582' x2='0.5' y2='5.32418' id='Line-1'>
              <animate
                attributeType='XML'
                attributeName='y1'
                values={muted ? '3;3' : '3;0;3'}
                keyTimes='0;0.5;1'
                dur='.9s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
              <animate
                attributeType='XML'
                attributeName='y2'
                values={muted ? '4;4' : '4;7;4'}
                keyTimes='0;0.5;1'
                dur='.9s'
                repeatCount={muted ? '0' : 'indefinite'}
              ></animate>
            </line>
          </g>
        </svg>
      </span>
    </button>
  );
};
