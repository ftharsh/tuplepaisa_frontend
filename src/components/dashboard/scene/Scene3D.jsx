import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import WalletModel from "../models/WalletModel.jsx";
import CoinStack from "../models/CoinStack.jsx";
import ShieldModel from "../models/ShieldModel.jsx";
import ChartModel from "../models/ChartModel.jsx";
import Loader from "../common/Loader.jsx";

const Scene3D = ({ type, isAnimating }) => {
  const models = {
    wallet: <WalletModel isAnimating={isAnimating} />,
    send: (
      <group>
        <CoinStack position={[-2, 0, 0]} isAnimating={isAnimating} />
        <CoinStack position={[-1.5, 0.3, 0]} isAnimating={isAnimating} />
      </group>
    ),
    security: <ShieldModel isAnimating={isAnimating} />,
    invest: <ChartModel isAnimating={isAnimating} />,
    settings: <WalletModel isAnimating={isAnimating} />,
  };

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Suspense fallback={<Loader />}>{models[type]}</Suspense>
    </Canvas>
  );
};

export default Scene3D;
