import { useState, useEffect } from "react";

interface Slide {
  image: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
}

interface CarouselProps {
  slides: Slide[];
}

const CarousalComponent: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState<number>(0);
  const [animateText, setAnimateText] = useState<boolean>(false);

  const nextSlide = () => {
    if (current === slides.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [current]);

  useEffect(() => {
    if (current === 1) {
      setAnimateText(true);
    } else {
      setAnimateText(false);
    }
  }, [current]);

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
      `}</style>
    
      <div className="carousalDiv overflow-hidden object-contain relative w-full h-[650px] z-0">
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
                 <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full h-full z-10 pt-60 pl-36">
                <p className={`text-lg md:text-2xl lg:text-6xl font-serif ${current === index ? 'fade-in move-in-left' : ''}`}>{slide.text1}</p>
                <p className={`text-lg md:text-2xl lg:text-5xl font-serif ${current === index ? 'fade-in move-in-left' : ''}`} style={{ animationDelay: '0.2s' }}>{slide.text2}</p>
                <p className={`text-lg md:text-2xl lg:text-4xl font-serif ${current === index ? 'fade-in move-in-left' : ''}`} style={{ animationDelay: '0.4s' }}>{slide.text3}</p>
                <p className={`text-lg md:text-2xl lg:text-5xl font-serif ${current === index ? 'fade-in move-in-left' : ''}`} style={{ animationDelay: '0.6s' }}>{slide.text4}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CarousalComponent;