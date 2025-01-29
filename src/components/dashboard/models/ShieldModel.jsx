import React, { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";
import { THEME } from "../../../Constant/theme.js";

const ShieldModel = ({ isAnimating }) => {
  const meshRef = useRef();

  const springs = useSpring({
    scale: isAnimating ? [1.2, 1.2, 1.2] : [1, 1, 1],
    rotation: isAnimating ? [0, Math.PI * 2, 0] : [0, 0, 0],
    config: { tension: 100, friction: 10 },
  });

  return (
    <animated.group
      ref={meshRef}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      <mesh>
        <boxGeometry args={[1.8, 2.2, 0.2]} />
        <meshPhongMaterial
          color={THEME.primary}
          transparent
          opacity={0.9}
          specular={THEME.highlight}
          shininess={50}
        />
      </mesh>

      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[1.6, 2, 0.01]} />
        <meshPhongMaterial color={THEME.secondary} specular={THEME.highlight} />
      </mesh>

      <group position={[0, 0.2, 0.12]}>
        <mesh>
          <torusGeometry args={[0.4, 0.08, 16, 32]} />
          <meshStandardMaterial
            color={THEME.gold}
            metalness={0.8}
            roughness={0.2}
          />
          {/*istanbul ignore file*/}
        </mesh>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color={THEME.accent}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>
    </animated.group>
  );
};

export default ShieldModel;
