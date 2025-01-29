import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { THEME } from "../../../Constant/theme.js";

const WalletModel = ({ isAnimating }) => {
  const meshRef = useRef();

  const springs = useSpring({
    scale: isAnimating ? [1.2, 1.2, 1.2] : [1, 1, 1],
    rotation: isAnimating ? [0, Math.PI * 2, 0] : [0, 0, 0],
    config: { tension: 100, friction: 10 },
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  // Colors matching the icon
  const NAVY_BLUE = "#1e2749";
  const LIGHT_BLUE = "#2196f3";

  return (
    <animated.group
      ref={meshRef}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      {/* Main wallet body */}
      <mesh>
        <boxGeometry args={[2, 1.4, 0.2]} />
        <meshStandardMaterial
          color={NAVY_BLUE}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Wallet front face (white area) */}
      <mesh position={[0, 0, 0.101]}>
        <boxGeometry args={[1.9, 1.3, 0.001]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Wallet closure flap */}
      <mesh position={[0.8, 0, 0.102]}>
        <boxGeometry args={[0.4, 1.3, 0.02]} />
        <meshStandardMaterial
          color={NAVY_BLUE}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/*istanbul ignore file*/}
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
