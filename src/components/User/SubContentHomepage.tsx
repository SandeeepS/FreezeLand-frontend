import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

function SubContentHomepage() {
  return (
    <>
      <div className="bg-slate-100 w-full flex flex-col lg:flex-row">
        <motion.div
          className="flex-1 lg:flex-grow"
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
        >
          <div className="pt-10 sm:pt-16 md:pt-20 flex flex-col justify-center items-center px-4 sm:px-6 lg:pl-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center lg:text-left">
              YOUR
              <span className="text-freeze-color font-Metal italic">
                {" "}
                DREAMS
              </span>
            </h1>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center lg:text-left">
              OUR
              <span className="text-freeze-color font-Metal italic">
                {" "}
                EXPERTISE
              </span>
            </h1>
          </div>

          <div className="pt-6 sm:pt-8 md:pt-12 flex flex-col justify-center items-center px-4 sm:px-6 lg:pl-12">
            <h6 className="text-sm sm:text-base md:text-lg text-center lg:text-left leading-relaxed">
              In the Montreal area, we provide a full-service interior design
              and turnkey renovation solution. We handle every stage, from
              initial design to final completion, ensuring the creation of
              harmonious and functional interiors.
            </h6>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          className="flex-1 flex justify-center items-center mt-8 lg:mt-0"
        >
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 sm:p-6 md:p-8">
            <img
              src="/Images/acWall3.jpg"
              alt="Interior Design"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SubContentHomepage;
