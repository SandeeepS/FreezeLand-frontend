import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

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
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white fixed top-0 left-0 z-50">
      {/* Lottie Animation Container - responsive sizing */}
      <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-72 lg:h-72 mb-2 sm:mb-4">
        <DotLottieReact
          src="https://lottie.host/fd543e94-57b6-41ff-92b9-bf3774e0c7b6/nZZvgbvNOi.lottie"
          loop
          autoplay
        />
      </div>

      {/* Progress Bar - responsive sizing */}
      <div className="w-40 sm:w-48 md:w-52 lg:w-64 bg-gray-200 rounded-full h-1.5 sm:h-2 mx-4">
        <div
          className="bg-blue-500 h-full rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </div>
  );
};

export default InitialLoader;
