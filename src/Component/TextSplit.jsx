import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Interface for TextSplit component props

/**
 * @typedef {Object} AnimationConfig
 * @property {Function} [enter] - Custom enter animation function
 * @property {Function} [exit] - Custom exit animation function
 * @property {Object} [options] - Animation options to override presets
 * @property {Object} [custom] - Complete animation override
 */

/**
 * @typedef {'char'|'word'|'line'|Function} SplitByOption
 * @typedef {'parent'|'self'|'none'} TriggerType
 * @typedef {'fade'|'slide'|'custom'} AnimationPreset
 */

/**
 * Advanced text splitting animation component with GSAP integration
 * @param {Object} props
 * @param {React.ReactNode} props.children - Text content to animate
 * @param {React.ElementType} [props.as="div"] - Wrapper element/component
 * @param {React.ElementType} [props.unitAs="span"] - Individual animated unit element
 * @param {SplitByOption} [props.splitBy="char"] - Text splitting strategy
 * @example // Split by character (default)
 * splitBy="char"
 * @example // Split by words
 * splitBy="word"
 * @example // Custom split function
 * splitBy={(text) => text.match(/[A-Z]/g)}
 * 
 * @param {TriggerType} [props.trigger="parent"] - Animation trigger type
 * @example // Trigger on parent hover
 * trigger="parent"
 * @example // Trigger on individual unit hover
 * trigger="self"
 * 
 * @param {AnimationPreset} [props.animation="fade"] - Preset animation style
 * @example // Fade animation
 * animation="fade"
 * @example // Slide animation
 * animation="slide"
 * 
 * @param {AnimationConfig} [props.animationConfig] - Animation configuration
 * @example // Override stagger timing
 * animationConfig={{ options: { stagger: 0.1 } }}
 * @example // Custom enter animation
 * animationConfig={{ enter: (els) => gsap.from(els, { opacity: 0 }) }}
 * 
 * @param {boolean} [props.hover=true] - Enable hover interactions
 * @param {boolean|Object} [props.scroll=false] - Scroll-triggered animation
 * @param {boolean} [props.animateInView=false] - Auto-animate when in view
 * @param {boolean} [props.active] - Manual animation control
 * @param {Function} [props.onHover] - Hover start callback
 * @param {Function} [props.onUnhover] - Hover end callback
 * @param {boolean} [props.prefersReducedMotion] - Motion preference override
 * 
 * @example // Basic usage
 * <TextSplit>Animate Me</TextSplit>
 * 
 * @example // Scroll-triggered word animation
 * <TextSplit
 *   splitBy="word"
 *   scroll={{ scrub: true }}
 *   animationConfig={{ options: { stagger: 0.2 } }}
 * >
 *   Scroll Activated
 * </TextSplit>
 */
const TextSplit = forwardRef(
  (
    {
      children,
      as: Wrapper = "div",
      unitAs: Unit = "span",
      splitBy = "char",
      trigger = "parent",
      animation = "fade",
      animationConfig = {},
      hover = true,
      scroll = false,
      animateInView = false,
      active,
      onHover,
      onUnhover,
      prefersReducedMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
      ...props
    },
    ref
  ) => {
    const wrapperRef = useRef();
    const { contextSafe } = useGSAP({ scope: wrapperRef });
    const tl = useRef(gsap.timeline({ paused: true }));
    const unitsRef = useRef([]);

    const animationPresets = (elements, options = {}) => ({
      fade: {
        enter: () => gsap.from(elements, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ...options // Allows overriding any values
        }),
        exit: () => gsap.to(elements, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ...options
        })
      },
      slide: {
        enter: () => gsap.from(elements, {
          x: 100,
          rotation: 15,
          duration: 0.6,
          stagger: 0.1,
          ...options
        }),
        exit: () => gsap.to(elements, {
          x: -100,
          rotation: -15,
          duration: 0.6,
          ...options
        })
      }
    });

    // Split content logic
    const splitContent = useMemo(() => {
      if (!children) return [];
      const content = String(children);
      const strategies = {
        char: () => content.split(""),
        word: () => content.split(/\s+/).filter(w => w),
        line: () => content.split(/\n/),
        custom: () => splitBy(content)
      };
      return strategies[typeof splitBy === "function" ? "custom" : splitBy]?.() || [content];
    }, [children, splitBy]);

    // Animation setup
    useGSAP(() => {
      if (prefersReducedMotion) return;

      const elements = unitsRef.current;
      const presets = animationPresets(elements, animationConfig.options);
      const config = animationConfig.custom || presets[animation];

      tl.current.clear();

      if (scroll) {
        gsap.set(elements, { opacity: 0, y: 20 });
        tl.current.to(elements, {
          ...config.enter().vars,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            ...scroll
          }
        });
      } else {
        tl.current.add(config.enter());
        if (animationConfig.exit) tl.current.add(config.exit(), "<");
      }

      if (animateInView) {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top 80%",
          onEnter: () => tl.current.play(),
          onLeaveBack: () => tl.current.reverse()
        });
      }
    }, [animation, splitContent, scroll, animateInView, animationConfig]);

    // Controlled component
    useEffect(() => {
      if (typeof active !== "undefined") {
        active ? tl.current.play() : tl.current.reverse();
      }
    }, [active]);

    // Event handlers
    const createHandlers = index => ({
      onMouseEnter: contextSafe(() => {
        if (trigger === "self" && !prefersReducedMotion) {
          gsap.to(unitsRef.current[index], {
            scale: 1.2,
            duration: 0.3,
            overwrite: true,
          });
        }
        onHover?.();
      }),
      onMouseLeave: contextSafe(() => {
        if (trigger === "self" && !prefersReducedMotion) {
          gsap.to(unitsRef.current[index], {
            scale: 1,
            duration: 0.3,
            overwrite: true,
          });
        }
        onUnhover?.();
      }),
    });

    return (
      <Wrapper
        ref={mergeRefs(wrapperRef, ref)}
        {...(trigger === "parent" && {
          onMouseEnter: contextSafe(() => hover && !prefersReducedMotion && tl.current.play()),
          onMouseLeave: contextSafe(() => hover && !prefersReducedMotion && tl.current.reverse()),
        })}
        {...props}
      >
        {splitContent.map((unit, index) => (
          <Unit
            ref={el => (unitsRef.current[index] = el)}
            className='animated-unit'
            key={`${unit}-${index}`}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            {...(trigger === "self" && createHandlers(index))}
          >
            {unit === " " ? "\u00A0" : unit}
          </Unit>
        ))}
      </Wrapper>
    );
  }
);

// Helper function to merge refs
const mergeRefs =
  (...refs) =>
  value => {
    refs.forEach(ref => {
      if (typeof ref === "function") ref(value);
      else if (ref != null) ref.current = value;
    });
  };

export default TextSplit;
