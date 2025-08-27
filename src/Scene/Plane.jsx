import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import useGPGPU from "../Util/Gpgpu";

const Plane = ({ width, height, active, ...props }) => {
  const $mesh = useRef();
  const { viewport, gl: renderer } = useThree();
  const mouseIdleTime = useRef(0);
  const isMouseMoving = useRef(false);
  const [hovered, setHovered] = useState(false);
  const inactivityTimer = useRef(null);
  let isFadingOut = false;
  
  // Mouse position tracking for step pattern
  const currentMousePos = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMousePos = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouseDirection = useRef(0.0);
  const targetMouseDirection = useRef(0.0);
  const lastMouseX = useRef(0.5);
  const lastMouseY = useRef(0.5);
  const currentOilSpillOffset = useRef(0.0);
  const targetOilSpillOffset = useRef(0.0);
  const currentEffectVisibility = useRef(0.0);
  const targetEffectVisibility = useRef(0.0);
  const mouseMovementTimer = useRef(0);
  const mouseVelocity = useRef(new THREE.Vector2(0, 0));
  const mouseInertiaPos = useRef(new THREE.Vector2(0.5, 0.5)); 


  // GPGPU params
  const gpgpuParams = useMemo(
    () => ({
      relaxation: 2.0, // Slightly higher for smoother dissipation
      size: 4096, // Higher resolution for better quality
      distance: 1.0, // Larger influence area
      strengh: 2.0, // Full strength
    }),
    []
  );

  // Use GPGPU hook
  const { compute, getTexture, updateMouse } = useGPGPU({
    renderer,
    size: gpgpuParams.size,
    params: gpgpuParams,
  });

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uDisplacementTexture: { value: null },
        uTime: { value: 0 },
        uMouseSpeed: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uIntensity: { value: 1.2 }, // Slightly higher intensity
        uRGBShift: { value: 0.93 }, // More pronounced RGB shift
        uChromaticAberration: { value: 0.95 }, // More pronounced chromatic aberration
        // New uniforms for step pattern
        uStepCount: { value: 100.0 }, // Number of steps (can be controlled)
        uStepSize: { value: 1.0 }, // Size of each step
        uPatternOpacity: { value: 0.75 }, // Opacity of the pattern
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) }, // Mouse position for step pattern
        uStepRadius: { value: 0.1 }, // Radius around mouse where steps are visible
        uStepLerpSpeed: { value: 0.025 }, // Lerp speed for smooth mouse following
        uMouseDirection: { value: 0.0 }, // Mouse direction (-1 to 1, negative = left, positive = right)
        uOilSpillOffset: { value: 0.0 }, // Offset for oil spill color flow
        uOilSpillSpeed: { value: 0.5 }, // Speed of oil spill color flow
        uEffectVisibility: { value: 0.5 }, // Effect visibility based on mouse movement
        uVisibilityLerpSpeed: { value: 0.01 }, // Very slow lerp for visibility transitions
        uMouseInertia: { value: 1.0 }, // Inertia factor for mouse movement
        uMouseLerpSpeed: { value: 0.09 }, // Mouse position lerp speed
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Add subtle vertex displacement for organic movement
          float vertexDisplacement = sin(pos.x * 10.0 + uTime * 0.5) * 0.001;
          pos.z += vertexDisplacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uDisplacementTexture;
        uniform float uTime;
        uniform float uMouseSpeed;
        uniform vec2 uResolution;
        uniform float uIntensity;
        uniform float uRGBShift;
        uniform float uChromaticAberration;
        uniform float uStepCount;
        uniform float uStepSize;
        uniform float uPatternOpacity;
        uniform vec2 uMousePosition;
        uniform float uStepRadius;
        uniform float uStepLerpSpeed;
        uniform float uMouseDirection;
        uniform float uOilSpillOffset;
        uniform float uOilSpillSpeed;
        uniform float uEffectVisibility;
        uniform float uVisibilityLerpSpeed;
        uniform float uMouseInertia;
        uniform float uMouseLerpSpeed;
        
        varying vec2 vUv;
        
        // Noise function for additional organic effects
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // Smooth noise
        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        // Fractal noise for organic movement
        float fractalNoise(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for(int i = 0; i < 3; i++) {
            value += amplitude * smoothNoise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        // Enhanced oil spill color palette function with focus on magenta, purple, and cyan
        vec3 oilSpillColor(float t) {
          // Focus on magenta, purple, and deep cyan
          vec3 color1 = vec3(1.0, 0.1, 0.9);   // Bright magenta
          vec3 color2 = vec3(0.4, 0.1, 1.0);   // Deep purple
          vec3 color3 = vec3(0.1, 0.8, 1.0);   // Deep cyan
          vec3 color4 = vec3(0.8, 0.2, 1.0);   // Magenta-purple
          vec3 color5 = vec3(0.2, 0.6, 1.0);   // Purple-cyan
          vec3 color6 = vec3(1.0, 0.3, 0.8);   // Bright magenta-pink
          
          // Create smooth transitions between colors
          float normalizedT = mod(t + uOilSpillOffset, 6.0);
          float index = floor(normalizedT);
          float fract = normalizedT - index;
          
          vec3 color;
          if (index == 0.0) color = mix(color1, color2, fract);
          else if (index == 1.0) color = mix(color2, color3, fract);
          else if (index == 2.0) color = mix(color3, color4, fract);
          else if (index == 3.0) color = mix(color4, color5, fract);
          else if (index == 4.0) color = mix(color5, color6, fract);
          else color = mix(color6, color1, fract);
          
          // Enhanced iridescent shimmer
          float shimmer = sin(t * 25.0 + uTime * 0.8) * 0.15 + 0.85;
          color *= shimmer;
          
          return color;
        }
        
        // Fluid glass step pattern function
        vec4 createStepPattern(vec2 uv) {
          // Calculate distance from current pixel to mouse position
          float distanceToMouse = distance(uv, uMousePosition);
          
          // Create a smooth falloff based on radius
          float falloff = 1.0 - smoothstep(0.0, uStepRadius, distanceToMouse);
          
          // Only show steps within the radius
          if (falloff <= 0.0) {
            return vec4(0.0, 0.0, 0.0, 0.0); // Transparent outside radius
          }
          
          // Create repeating vertical steps
          float stepValue = floor(uv.x * uStepCount * uStepSize);
          
          // Get the position within each step (0.0 to 1.0)
          float stepPosition = fract(uv.x * uStepCount * uStepSize);
          
          // Create tighter, more focused animated noise for color flow
          float animatedNoise1 = fractalNoise(vec2(uTime * 0.5, uTime * 0.3) + uv * 8.0);
          float animatedNoise2 = fractalNoise(vec2(uTime * 0.7, uTime * 0.2) + uv * 12.0);
          float animatedNoise3 = fractalNoise(vec2(uTime * 0.3, uTime * 0.6) + uv * 16.0);
          
          // Create tighter splatter patterns
          float splatterNoise1 = fractalNoise(vec2(uTime * 0.9, uTime * 0.4) + uv * 20.0);
          float splatterNoise2 = fractalNoise(vec2(uTime * 0.2, uTime * 0.8) + uv * 24.0);
          
          // Combine noise layers for tighter fluid movement
          float fluidFlow = (animatedNoise1 * 0.35 + animatedNoise2 * 0.25 + animatedNoise3 * 0.2 + splatterNoise1 * 0.15 + splatterNoise2 * 0.05);
          
          // Create tighter time-based color flow
          float colorTime1 = uTime * 0.4 + fluidFlow * 3.0 + uOilSpillOffset;
          float colorTime2 = uTime * 0.3 + animatedNoise1 * 4.0 + uOilSpillOffset * 0.8;
          float colorTime3 = uTime * 0.2 + splatterNoise1 * 5.0 + uOilSpillOffset * 0.6;
          
          vec3 oilSpillColor1 = oilSpillColor(colorTime1);
          vec3 oilSpillColor2 = oilSpillColor(colorTime2);
          vec3 oilSpillColor3 = oilSpillColor(colorTime3);
          
          // Mix oil spill colors based on animated noise
          vec3 fluidOilSpill = mix(oilSpillColor1, oilSpillColor2, animatedNoise1);
          fluidOilSpill = mix(fluidOilSpill, oilSpillColor3, splatterNoise1);
          
          // Flip the step direction based on mouse movement
          float adjustedStepPosition = stepPosition;
          if (uMouseDirection > 0.0) {
            adjustedStepPosition = 1.0 - stepPosition;
          }
          
          // Calculate glass brightness (how close to white)
          float glassBrightness = 1.0 - adjustedStepPosition; // 1.0 = white, 0.0 = dark
          
          // Create chromatic aberration at step edges
          float edgeThreshold = 0.15; // How much of the step edge gets chromatic aberration
          float edgeFactor = smoothstep(0.0, edgeThreshold, glassBrightness) * smoothstep(1.0, 1.0 - edgeThreshold, glassBrightness);
          
          // Create chromatic aberration colors
          vec3 chromaticRed = oilSpillColor(uTime * 0.3 + fluidFlow * 2.0);
          vec3 chromaticGreen = oilSpillColor(uTime * 0.3 + fluidFlow * 2.0 + 0.5);
          vec3 chromaticBlue = oilSpillColor(uTime * 0.3 + fluidFlow * 2.0 + 1.0);
          
          // Create the step color: fluid oil spill for bright areas, transparent for dark areas
          vec3 stepColor;
          float alpha;
          
          if (glassBrightness > 0.05) {
            // Bright areas: use fluid oil spill colors
            stepColor = fluidOilSpill;
            alpha = glassBrightness * uEffectVisibility; // Fade based on visibility
            
            // Add chromatic aberration at edges
            float chromaticStrength = edgeFactor * 0.8;
            stepColor = mix(stepColor, chromaticRed, chromaticStrength * 0.3);
            stepColor = mix(stepColor, chromaticGreen, chromaticStrength * 0.3);
            stepColor = mix(stepColor, chromaticBlue, chromaticStrength * 0.4);
          } else {
            // Dark areas: transparent
            stepColor = vec3(0.0, 0.0, 0.0);
            alpha = 0.0;
          }
          
          // Add subtle fluid texture
          stepColor += fluidFlow * 0.03 * uEffectVisibility;
          
          // Apply falloff to make it fade out at the edges
          return vec4(stepColor * falloff, alpha * falloff);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create fluid glass step pattern
          vec4 stepPattern = createStepPattern(uv);
          
          // Transparent background (no blue tint)
          vec3 background = vec3(0.0, 0.0, 0.0);
          
          // Mix step pattern with background using alpha
          vec3 finalColor = mix(background, stepPattern.rgb, stepPattern.a * uPatternOpacity);
          
          // Apply intensity
          finalColor *= uIntensity;
          
          // Set alpha to be transparent
          float alpha = stepPattern.a * uPatternOpacity;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    }),
    [width, height]
  );

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  // Start sound with fade-in when mouse enters
  const handlePointerEnter = () => {
    setHovered(true)
  };

  // Fade out to volume 0 on mouse leave to avoid popping
  const handlePointerLeave = () => {
    setHovered(false)
  };

  // Handle mouse move over the plane to update the GPGPU texture
  const handlePointerMove = event => {
    const uv = event.uv; // UV coordinates of the mouse over the plane
    if (uv) {
      updateMouse(uv); // Update GPGPU state with the mouse position
      
      // Calculate mouse velocity and direction
      const mouseDeltaX = uv.x - lastMouseX.current;
      const mouseDeltaY = uv.y - lastMouseY.current;
      const currentMousePos = new THREE.Vector2(uv.x, uv.y);
      
      // Update velocity with inertia (smoother)
      const inertiaFactor = shaderArgs.uniforms.uMouseInertia.value;
      const newVelocity = new THREE.Vector2(mouseDeltaX * 10, mouseDeltaY * 10); // Amplify velocity
      mouseVelocity.current.lerp(newVelocity, 1.0 - inertiaFactor);
      
      // Calculate mouse speed
      const mouseSpeed = Math.sqrt(mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY);
      
      // Apply target position directly
      targetMousePos.current.copy(currentMousePos);
      
      // Update mouse direction
      targetMouseDirection.current = Math.sign(mouseDeltaX);
      lastMouseX.current = uv.x;
      lastMouseY.current = uv.y;
      
      // Update oil spill offset based on mouse movement
      targetOilSpillOffset.current += mouseSpeed * 0.1;
      
      // Update effect visibility based on mouse movement
      targetEffectVisibility.current = 1.0;
      mouseMovementTimer.current = 0;
    }
  };

  useFrame(({ clock }) => {
    compute();
    
    if ($mesh.current && $mesh.current.material) {
      $mesh.current.material.uniforms.uDisplacementTexture.value = getTexture();
      $mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Lerp mouse position for smooth following with controlled speed
      const mouseLerpSpeed = shaderArgs.uniforms.uMouseLerpSpeed.value;
      currentMousePos.current.lerp(targetMousePos.current, mouseLerpSpeed);
      
      // Lerp mouse direction for smooth transitions
      currentMouseDirection.current = THREE.MathUtils.lerp(
        currentMouseDirection.current, 
        targetMouseDirection.current, 
        mouseLerpSpeed
      );
      
      // Lerp oil spill offset for slow flowing effect
      const oilSpillLerpSpeed = shaderArgs.uniforms.uOilSpillSpeed.value;
      currentOilSpillOffset.current = THREE.MathUtils.lerp(
        currentOilSpillOffset.current,
        targetOilSpillOffset.current,
        oilSpillLerpSpeed
      );
      
      // Handle mouse movement timer and effect visibility
      mouseMovementTimer.current += 0.016; // ~60fps
      const mouseIdleThreshold = 0.5; // 0.5 seconds of no movement
      
      if (mouseMovementTimer.current > mouseIdleThreshold) {
        targetEffectVisibility.current = 0.0; // Hide effect when mouse stops moving
      }
      
      // Lerp effect visibility for smooth transitions
      const visibilityLerpSpeed = shaderArgs.uniforms.uVisibilityLerpSpeed.value;
      currentEffectVisibility.current = THREE.MathUtils.lerp(
        currentEffectVisibility.current,
        targetEffectVisibility.current,
        visibilityLerpSpeed
      );
      
      // Update shader uniforms
      $mesh.current.material.uniforms.uMousePosition.value.copy(currentMousePos.current);
      $mesh.current.material.uniforms.uMouseDirection.value = currentMouseDirection.current;
      $mesh.current.material.uniforms.uOilSpillOffset.value = currentOilSpillOffset.current;
      $mesh.current.material.uniforms.uEffectVisibility.value = currentEffectVisibility.current;
    }
  });

  return (
    <mesh 
      ref={$mesh} 
      name="displacement-plane" 
      {...props} 
      onPointerMove={handlePointerMove} 
      onPointerEnter={handlePointerEnter} 
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[width, height, 64, 64]} />
      <shaderMaterial args={[shaderArgs]} transparent={true} />
    </mesh>
  );
};

export default Plane;
