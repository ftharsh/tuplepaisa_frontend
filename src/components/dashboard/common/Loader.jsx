import React from "react";
import { Html, useProgress } from "@react-three/drei";
import { ClipLoader } from "react-spinners";

export const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-4">
        <ClipLoader color="#ffffff" size={50} />
        <div className="text-white text-lg font-semibold">
          Loading... {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
};

export default Loader;
