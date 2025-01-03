import { useState } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

interface CarouselProps {
  slides: string[];
}

const CarousalComponent: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState<number>(0);

  const previousSlide = () => {
    if (current === 0) {
      setCurrent(slides.length - 1);
    } else {
      setCurrent(current - 1);
    }
  };

  const nextSlide = () => {
    if (current === slides.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <>
      <div className="overflow-hidden pt-20 md:pt-6   object-contain relative w-full ">
        <div
          className="flex transition  ease-out duration-400 w-full "
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((s) => {
            return (
              <img
                src={s}
                alt=""
                className=" md:object-cover w-full lg:h-[1000px]  flex-shrink-0 "
              />
            );
          })}
        </div>

        <div className="absolute top-0 h-full w-full justify-between items-center flex px-4">
          <button onClick={previousSlide}>
            <FaArrowAltCircleLeft />
          </button>
          <button onClick={nextSlide}>
            <FaArrowAltCircleRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default CarousalComponent;
