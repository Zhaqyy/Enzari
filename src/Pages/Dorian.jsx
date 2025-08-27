import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, MeshTransmissionMaterial } from "@react-three/drei";
import { Text as DreiText } from '@react-three/drei';
import * as THREE from "three";
import gsap from "gsap";
import Plane from "../Scene/Plane";
import "../Style/Dorian.scss";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import font from "/Font/uni.ttf";
import useIsMobile from "../Util/isMobile";

export function DorianModel({ mouseSpeed, mousePosition, rotationSpeed }) {
  const { nodes, materials } = useGLTF("/Model/dorian.glb");
  const meshRefs = useRef(null);

  useFrame(state => {
    // Auto-rotate with mouse speed influence
    const baseRotationSpeed = 0.5;
    const mouseInfluence = Math.min(mouseSpeed * 0.1, 2.0);
    const totalRotationSpeed = baseRotationSpeed + mouseInfluence;

    if (meshRefs.current !== null) {
      meshRefs.current.rotation.y += totalRotationSpeed * 0.01;
    }
  });

  return (
    <group dispose={null} ref={meshRefs} scale={0.002} rotation={[1, 0, 0]} position-z={3}>
      <mesh geometry={nodes.Cube_0.geometry} position={[0, 0, -200]} rotation={[0, 1.571, 0]}>
        <MeshTransmissionMaterial
          ior={1}
          color={'#a39494'}
          anisotropy={1}
          chromaticAberration={1}
          thickness={10}
          opacity={1}
          transparent={false}
        />
      </mesh>
      <mesh geometry={nodes.Cube_1.geometry} position={[156.366, 0, -124.698]} rotation={[0, 0.673, 0]}>
        <MeshTransmissionMaterial
          ior={1}
          color={'#a39494'}
          anisotropy={1}
          chromaticAberration={1}
          thickness={10}
          opacity={1}
          transparent={false}
        />
      </mesh>
      <mesh geometry={nodes.Cube_2.geometry} position={[194.986, 0, 44.504]} rotation={[0, -0.224, 0]}>
        <MeshTransmissionMaterial
          ior={1}
          color={'#a39494'}
          anisotropy={1}
          chromaticAberration={1}
          thickness={10}
          opacity={1}
          transparent={false}
        />
      </mesh>
      <mesh geometry={nodes.Cube_3.geometry} position={[86.777, 0, 180.194]} rotation={[0, -1.122, 0]}>
        <MeshTransmissionMaterial
          ior={1}
          color={'#a39494'}
          anisotropy={1}
          chromaticAberration={1}
          thickness={10}
          opacity={1}
          transparent={false}
        />
      </mesh>
      <mesh geometry={nodes.Cube_4.geometry} position={[-86.777, 0, 180.194]} rotation={[Math.PI, -1.122, Math.PI]}>
        <MeshTransmissionMaterial
          ior={1}
          color={'#a39494'}
          anisotropy={1}
          chromaticAberration={1}
          thickness={10}
          opacity={1}
          transparent={false}
        />
      </mesh>
      <mesh geometry={nodes.Cube_5.geometry} position={[-194.986, 0, 44.504]} rotation={[Math.PI, -0.224, Math.PI]}>
        <MeshTransmissionMaterial
          ior={1}
          color={'#a39494'}
          anisotropy={1}
          chromaticAberration={1}
          thickness={10}
          opacity={1}
          transparent={false}
        />
      </mesh>
      <mesh geometry={nodes.Cube_6.geometry} position={[-156.366, 0, -124.698]} rotation={[-Math.PI, 0.673, -Math.PI]}>
        <MeshTransmissionMaterial
          ior={1}
          color={'#a39494'}
          anisotropy={1}
          chromaticAberration={1}
          thickness={10}
          opacity={1}
          transparent={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/Model/dorian.glb");

// Main Dorian Page Component
const Dorian = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const descriptionFontSize = Math.min(viewport.width * 0.08, 0.18);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleMouseMove = event => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;

      if (deltaTime > 0) {
        const currentX = (event.clientX / window.innerWidth) * 2 - 1;
        const currentY = -(event.clientY / window.innerHeight) * 2 + 1;

        const deltaX = currentX - lastMousePosition.current.x;
        const deltaY = currentY - lastMousePosition.current.y;
        const speed = (Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime) * 1000;

        setMousePosition({ x: currentX, y: currentY });
        setMouseSpeed(speed);

        lastMousePosition.current = { x: currentX, y: currentY };
        lastTime.current = currentTime;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className='dorian-page'>
      <div className='dorian-content'>
      
        <div className='dorian-canvas'>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{
              background: "transparent",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              pointerEvents: "auto",
            }}
          >
            <EffectComposer>
              <Fluid 
              radius={0.3}
              curl={0.1}
              swirl={0.1}
              distortion={0.1}
              force={2}
              pressure={0.5}
              densityDissipation={0.95}
              velocityDissipation={1}
              intensity={0.007}
              rainbow={true}
              blend={0.005}
              showBackground={false}
              fluidColor='#722F37'
              />
            </EffectComposer>
            <Text />
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 2.5]} intensity={100} />
            {/* <pointLight position={[-10, -10, -10]} intensity={0.5} /> */}

            {/* Full-screen displacement effect */}
            <Plane width={20} height={20} position={[0, 0, 0]} active={true} />

            <DorianModel
              scale={0.005}
              position={[0, 0, 5]}
              rotation={[1, 0, 0]}
              mouseSpeed={mouseSpeed}
              mousePosition={[mousePosition.x, mousePosition.y]}
            />
             <DreiText
              maxWidth={isMobile ? 5.5 : 7.5}
              textAlign='center'
              fontSize={0.18}
              lineHeight={1.5}
              position-y={-1.5}
              color='white'>
              ENZARI STUDIOS SPECIALIZES IN GENERATIVE AI, REAL-TIME INTERACTIVITY, AND IMMERSIVE WEBGL
              EXPERIENCES.
          </DreiText>

            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Dorian;

const Text = () => {
  const { viewport } = useThree();
  const isMobile = useIsMobile();
  // Calculate responsive font sizes based on viewport
  const baseFontSize = Math.min(viewport.width * 0.2, 2.5);
  const secondaryFontSize = Math.min(viewport.width * 0.165, 2);
  
  return (
      <group position-y={0.2}>
          <DreiText
              letterSpacing={-0.07}
              font={font}
              fontSize={baseFontSize}
              position-y={isMobile ? 2 : 1.5}
              color='#ffffff'>
              ENZARI
          </DreiText>

          <DreiText
              letterSpacing={-0.07}
              font={font}
              position-y={isMobile ? 0.75 : -0.5}
              fontSize={secondaryFontSize}
              color='#ffffff'>
              STUDIOS
          </DreiText>

         
      </group>
  );
};
