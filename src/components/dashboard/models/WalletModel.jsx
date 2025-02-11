import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";

const WalletModel = ({ isAnimating }) => {
  const meshRef = useRef();

  const springs = useSpring({
    scale: isAnimating ? [1.2, 1.2, 1.2] : [1, 1, 1], // *zooms upto 120% of original size , when animating
    rotation: isAnimating ? [0, Math.PI * 2, 0] : [0, 0, 0], // *rotates 360 degrees [pie*2] when animating , along y axis only
    config: { tension: 100, friction: 10 }, //* tension decides spped of animtin , and friction slows it down
  });

  useFrame((state) => {
    // *using use frame , 4 evry frame y x rotation i sgetting increased by 0.005 --> spinning effect
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const NAVY_BLUE = "#1e2749";
  const LIGHT_BLUE = "#2196f3";

  return (
    <animated.group //* wraps around te animate wrapper , passing spring attr to it
      ref={meshRef}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      <mesh>
        <boxGeometry args={[2, 1.4, 0.2]} />
        <meshStandardMaterial
          color={NAVY_BLUE}
          roughness={0.5} //*how shiny it is
          metalness={0.1} //* how metallic surface is
        />
      </mesh>

      <mesh position={[0, 0, 0.101]}>
        {/* designing front face of wallet */}
        <boxGeometry args={[1.9, 1.3, 0.001]} />
        {/* the white face  */}
        {/* dimension f th box  */}
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Wallet closure flap */}
      <mesh position={[0.8, 0, 0.102]}>
        {/* the closure flap is setted a little right of the center[x axis ] and a little forward [z-axis] */}
        <boxGeometry args={[0.4, 1.3, 0.02]} />
        <meshStandardMaterial
          color={NAVY_BLUE}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Card peek-through effect */}
      <mesh position={[-0.3, 0.2, 0.103]}>
        <boxGeometry args={[1, 0.3, 0.01]} />
        <meshStandardMaterial
          color={LIGHT_BLUE}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Minimal detail lines */}
      {/* parallel 2 lines 1 at 0.2 and other at -0.2  */}
      {[-0.2, 0.2].map((yPos, index) => (
        <mesh key={index} position={[-0.5, yPos, 0.104]}>
          <boxGeometry args={[0.4, 0.02, 0.001]} />
          <meshStandardMaterial
            color={NAVY_BLUE}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      ))}
    </animated.group>
  );
};

export default WalletModel;
