import { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

const RupeeCoin = ({ isAnimating, position }) => {
  const groupRef = useRef();

  const springs = useSpring({
    position: isAnimating
      ? [position[0] + 2, position[1], position[2]]
      : position,
    rotation: isAnimating ? [0, Math.PI * 4, 0] : [0, 0, 0],
    config: { tension: 120, friction: 14 },
  });

  const ridgeCount = 75;
  const ridges = [];
  for (let i = 0; i < ridgeCount; i++) {
    const angle = (i / ridgeCount) * Math.PI * 2;
    ridges.push(
      <mesh
        key={i}
        position={[Math.cos(angle) * 0.38, 0, Math.sin(angle) * 0.38]}
        rotation={[0, -angle, 0]}
      >
        <boxGeometry args={[0.02, 0.06, 0.02]} />
        <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
      </mesh>
    );
  }

  const rupeeShape = new THREE.Shape();
  rupeeShape.moveTo(-0.15, 0.2);
  rupeeShape.lineTo(0.15, 0.2);
  rupeeShape.lineTo(0.15, 0.15);
  rupeeShape.lineTo(-0.1, 0.15);
  rupeeShape.lineTo(0.1, -0.2);
  rupeeShape.lineTo(0.15, -0.2);
  rupeeShape.lineTo(0.15, -0.15);
  rupeeShape.lineTo(-0.15, -0.15);
  rupeeShape.lineTo(-0.15, -0.2);
  rupeeShape.lineTo(0.05, -0.2);
  rupeeShape.lineTo(-0.15, 0.15);
  rupeeShape.lineTo(-0.15, 0.2);

  const extrudeSettings = {
    steps: 1,
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 3,
  };

  return (
    <animated.group
      ref={groupRef}
      position={springs.position}
      rotation={springs.rotation}
    >
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.2} />
      </mesh>

      {ridges}

      <mesh position={[0, 0.031, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.2} />
      </mesh>
      {/*istanbul ignore file*/}

      <mesh position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[rupeeShape, extrudeSettings]} />
        <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[0, -0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.2} />
      </mesh>
    </animated.group>
  );
};

export default RupeeCoin;
