import React, { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";
import { THEME } from "../../../Constant/theme.js";
import * as THREE from "three";

const ChartModel = ({ isAnimating }) => {
  const meshRef = useRef();
  const points = [];

  const numPoints = 20;
  for (let i = 0; i < numPoints; i++) {
    const x = (i - numPoints / 2) * 0.2;
    const y = Math.sin(i * 0.3) * 0.5 + Math.cos(i * 0.2) * 0.3;
    points.push(new THREE.Vector3(x, y, 0));
  }

  const springs = useSpring({
    scale: isAnimating ? [1.2, 1.2, 1.2] : [1, 1, 1],
    config: { tension: 100, friction: 10 },
  });

  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(50);

  return (
    <animated.group ref={meshRef} scale={springs.scale}>
      <gridHelper
        args={[4, 10]}
        position={[0, -1, -0.5]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial color={THEME.secondary} opacity={0.2} transparent />
      </gridHelper>
      {/*istanbul ignore file*/}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={
              new Float32Array(curvePoints.flatMap((p) => [p.x, p.y, p.z]))
            }
            count={curvePoints.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={THEME.accent} linewidth={2} />
      </line>

      {curvePoints.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color={THEME.primary}
            emissive={THEME.accent}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </animated.group>
  );
};

export default ChartModel;
