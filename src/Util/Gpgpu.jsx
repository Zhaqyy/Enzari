import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

const fragmentShader = `
uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uMouseSpeed;
uniform float uTime;
uniform float uGridSize;
uniform float uRelaxation;
uniform float uDistance;

// Noise function for organic movement
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

// Fractal noise
float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 4; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    
    // Get previous state
    vec4 color = texture(uGrid, uv);
    
    // Calculate distance from mouse
    float dist = distance(uv, uMouse);
    float influence = 1.0 - smoothstep(0.0, uDistance/uGridSize, dist);
    
    // Create vertical line displacement effect
    float verticalDisplacement = 0.0;
    
    // Only apply displacement in vertical direction (Y-axis)
    if (influence > 0.0) {
        // Create vertical line effect based on mouse speed
        float lineWidth = 0.008; // Thinner line for more precise effect
        float lineIntensity = uMouseSpeed * 0.3; // Increased intensity
        
        // Check if we're within the vertical line area
        float lineDistance = abs(uv.x - uMouse.x);
        if (lineDistance < lineWidth) {
            // Create smooth vertical displacement with more organic movement
            float verticalNoise = fractalNoise(vec2(uv.y * 15.0, uTime * 0.3));
            verticalDisplacement = verticalNoise * lineIntensity * influence;
            
            // Add wave-like movement that follows mouse direction
            float waveMovement = sin(uv.y * 25.0 + uTime * 1.5) * cos(uv.y * 12.0 + uTime * 0.8);
            verticalDisplacement += waveMovement * lineIntensity * influence * 0.5;
            
            // Add some turbulence for more organic feel
            float turbulence = fractalNoise(vec2(uv.y * 8.0 + uTime * 0.2, uTime * 0.1));
            verticalDisplacement += turbulence * lineIntensity * influence * 0.3;
        }
        
        // Create trailing effect - displacement follows mouse movement
        float trailingWidth = lineWidth * 3.0;
        float trailingDistance = abs(uv.x - uMouse.x);
        if (trailingDistance < trailingWidth && trailingDistance > lineWidth) {
            float trailingIntensity = (1.0 - (trailingDistance - lineWidth) / (trailingWidth - lineWidth)) * lineIntensity * 0.3;
            float trailingNoise = fractalNoise(vec2(uv.y * 10.0, uTime * 0.4));
            verticalDisplacement += trailingNoise * trailingIntensity * influence;
        }
    }
    
    // Fluid motion tracking - displacement follows mouse direction
    vec2 fluidDirection = uDeltaMouse * 1.0; // Increased fluid responsiveness
    float fluidStrength = length(fluidDirection) * influence;
    
    // Combine vertical displacement with fluid motion
    vec2 totalDisplacement = vec2(0.0, verticalDisplacement);
    totalDisplacement += fluidDirection * fluidStrength;
    
    // Add enhanced turbulence based on mouse speed
    float turbulence = uMouseSpeed * 0.08;
    vec2 turbulenceOffset = vec2(
        fractalNoise(vec2(uv.x * 8.0 + uTime * 0.2, uv.y * 8.0)),
        fractalNoise(vec2(uv.x * 8.0, uv.y * 8.0 + uTime * 0.2))
    ) * turbulence * influence;
    
    totalDisplacement += turbulenceOffset;
    
    // Add velocity-based displacement for more dynamic effect
    float velocityDisplacement = length(uDeltaMouse) * 0.2;
    vec2 velocityOffset = normalize(uDeltaMouse) * velocityDisplacement * influence;
    totalDisplacement += velocityOffset;
    
    // Update the displacement values
    color.rg += totalDisplacement;
    
    // Add RGB shift information to blue channel
    color.b = length(totalDisplacement) * 2.0;
    
    // Relaxation - gradually return to rest state
    color.rg *= uRelaxation;
    color.b *= uRelaxation;
    
    // Add some persistence for fluid effect
    color.a = mix(color.a, influence, 0.1);
    
    gl_FragColor = color;
}
`;

const useGPGPU = ({ renderer, size, params }) => {
  const gpgpuRef = useRef(null);
  const variableRef = useRef(null);
  const sizeRef = useRef(Math.ceil(Math.sqrt(size)));
  const timeRef = useRef(0);
  const dataTextureRef = useRef(null);
  const lastMousePos = useRef(new THREE.Vector2(0, 0));
  const mouseSpeed = useRef(0);

  useEffect(() => {
    // Initialize GPUComputationRenderer
    const gpgpuRenderer = new GPUComputationRenderer(sizeRef.current, sizeRef.current, renderer);
    gpgpuRef.current = gpgpuRenderer;

    // Create initial DataTexture
    const dataTexture = gpgpuRenderer.createTexture();
    dataTextureRef.current = dataTexture;

    // Add variable
    const variable = gpgpuRenderer.addVariable("uGrid", fragmentShader, dataTexture);
    variable.material.uniforms.uTime = { value: 0 };
    variable.material.uniforms.uRelaxation = { value: params.relaxation };
    variable.material.uniforms.uGridSize = { value: sizeRef.current };
    variable.material.uniforms.uMouse = { value: new THREE.Vector2(0.5, 0.5) };
    variable.material.uniforms.uDeltaMouse = { value: new THREE.Vector2(0, 0) };
    variable.material.uniforms.uMouseSpeed = { value: 0 };
    variable.material.uniforms.uDistance = { value: params.distance * 10 };

    variableRef.current = variable;

    // Set dependencies and initialize
    gpgpuRenderer.setVariableDependencies(variable, [variable]);
    gpgpuRenderer.init();

    return () => {
      // Clean up resources if necessary
      gpgpuRenderer.dispose();
    };
  }, [renderer, size, params]);

  const updateMouse = uv => {
    if (!variableRef.current) return;

    const currentMouse = new THREE.Vector2(uv.x, uv.y);
    const deltaMouse = new THREE.Vector2().subVectors(currentMouse, lastMousePos.current);
    
    // Calculate mouse speed
    mouseSpeed.current = deltaMouse.length() * 10.0;
    
    // Update uniforms
    variableRef.current.material.uniforms.uMouse.value.copy(currentMouse);
    variableRef.current.material.uniforms.uDeltaMouse.value.copy(deltaMouse);
    variableRef.current.material.uniforms.uMouseSpeed.value = mouseSpeed.current;
    
    lastMousePos.current.copy(currentMouse);
  };

  const compute = () => {
    if (gpgpuRef.current) {
      gpgpuRef.current.compute();
    }
    
    if (variableRef.current && variableRef.current.material) {
      // Update time
      variableRef.current.material.uniforms.uTime.value += 0.016; // ~60fps
      
      // Gradually reduce mouse speed for smooth dissipation
      variableRef.current.material.uniforms.uMouseSpeed.value *= 0.95;
    } 
  };
  
  const getTexture = () => {
    if (gpgpuRef.current) {
      return gpgpuRef.current.getCurrentRenderTarget(variableRef.current).texture;
    }
    return null;
  };

  return {
    updateMouse,
    compute,
    getTexture,
  };
};

export default useGPGPU;
