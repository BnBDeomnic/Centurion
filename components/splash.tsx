"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import SpaceManAnimation from "../public/spaceman.json";
import spaceBackground from "../public/space_bg.json";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fade, setFade] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // tunggu Lottie mount
    const timer = setTimeout(() => setLoaded(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setFade(false);
    setTimeout(onFinish, 800);
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-800 cursor-pointer ${
        fade ? "opacity-100" : "opacity-0"
      }`}
      style={{ overflow: "hidden" }}
    >
      {/* Background Lottie */}
      <div className="absolute inset-0 z-0">
        <Lottie animationData={spaceBackground} loop={true} />
      </div>

      {/* Container SpaceMan + teks */}
      <div className="relative w-72 h-72 mb-6 z-10 flex flex-col items-center justify-center">
        <Lottie
          animationData={SpaceManAnimation}
          loop={true}
          className="w-full h-full"
        />
        {loaded && (
          <h1 className="text-2xl font-bold text-white mt-4 text-center">
            Welcome to Centurion
          </h1>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
