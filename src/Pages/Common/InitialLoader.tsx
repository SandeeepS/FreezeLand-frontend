import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect, useState } from "react";

const InitialLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 30; // ms
    const totalTime = 3000; // 3 seconds
    const increment = 100 / (totalTime / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-freeze-color">
      <div className="w-60 h-60 mb-1">
        <DotLottieReact
          src="https://lottie.host/fd543e94-57b6-41ff-92b9-bf3774e0c7b6/nZZvgbvNOi.lottie"
          loop
          autoplay
        />
      </div>

      {/* Progress Bar */}
      <div className="w-52 bg-freeze-color rounded-full h-1.5">
        <div
          className="bg-white h-1.5 rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default InitialLoader;
