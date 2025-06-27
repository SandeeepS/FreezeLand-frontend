import { useState, useEffect } from "react";
import { CarouselProps } from "../../interfaces/IComponents/User/IUserInterfaces";

const CarousalComponent: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (current === slides.length - 1) {
        setCurrent(0);
      } else {
        setCurrent(current + 1);
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [current, slides.length]);

  return (
    <>
      <style>{`
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }

        .move-in-left {
          animation: moveInLeft 1s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes moveInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .carousel-content {
            padding: 1rem !important;
            padding-top: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .carousel-content {
            padding: 0.75rem !important;
            padding-top: 1.5rem !important;
          }
        }
      `}</style>

      <div className="carousalDiv overflow-hidden object-contain relative bg-freeze-color w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] z-0">
        <div
          className="flex transition-transform ease-out duration-400 w-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className="carousel-content absolute top-0 left-0 bg-black bg-opacity-50 text-white w-full h-full z-10 
                            p-2 pt-8 
                            sm:p-4 sm:pt-12 
                            md:p-6 md:pt-20 
                            lg:p-8 lg:pt-36 lg:pl-36
                            flex flex-col justify-center lg:justify-start"
              >
                <p
                  className={`font-serif 
                            text-sm sm:text-base md:text-lg lg:text-2xl xl:text-6xl
                            ${current === index ? "fade-in move-in-left" : ""}`}
                >
                  {slide.text1}
                </p>
                <p
                  className={`font-serif 
                            text-sm sm:text-base md:text-lg lg:text-xl xl:text-5xl
                            ${current === index ? "fade-in move-in-left" : ""}`}
                  style={{ animationDelay: "0.2s" }}
                >
                  {slide.text2}
                </p>
                <p
                  className={`font-serif 
                            text-xs sm:text-sm md:text-base lg:text-lg xl:text-4xl
                            ${current === index ? "fade-in move-in-left" : ""}`}
                  style={{ animationDelay: "0.4s" }}
                >
                  {slide.text3}
                </p>
                <p
                  className={`font-serif
                            text-sm sm:text-base md:text-lg lg:text-xl xl:text-5xl
                            ${current === index ? "fade-in move-in-left" : ""}`}
                  style={{ animationDelay: "0.6s" }}
                >
                  {slide.text4}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CarousalComponent;
