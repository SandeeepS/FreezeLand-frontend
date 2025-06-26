import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

const WhyChooseUs: React.FC = () => {
  return (
    <div>
      <div className="bg-slate-100 flex flex-col py-8 sm:py-12 md:py-16">
        {/* Title Section */}
        <motion.div
          className="flex items-center justify-center px-4"
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
        >
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center">
            Why Choose US?
          </h1>
        </motion.div>

        {/* Description Section */}
        <motion.div
          className="flex items-center justify-center text-center italic mt-3 sm:mt-4 md:mt-5 px-4"
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
        >
          <div className="max-w-4xl">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed">
              As a prominent name in the repair industry, we provide
              best-in-class AC repair and service with our highly-skilled
              technicians, quality parts, and latest tools & technologies
            </p>
          </div>
        </motion.div>

        {/* Cards Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center mt-8 sm:mt-10 md:mt-14 px-4 sm:px-6 md:px-8">
          {/* Card 1 */}
          <motion.div
            className="max-w-sm w-full rounded overflow-hidden shadow-lg m-2 sm:m-3 md:m-4"
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView={"show"}
          >
            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center mx-auto mt-4">
              <img
                src="/Images/certified tech.png"
                alt="Certified Technicians"
                className="w-full h-auto"
              />
            </div>

            <div className="px-4 sm:px-6 py-4 text-center">
              <div className="font-bold text-lg sm:text-xl mb-2 italic">
                Certified Technicians
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="max-w-sm w-full rounded overflow-hidden shadow-lg m-2 sm:m-3 md:m-4"
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView={"show"}
          >
            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center mx-auto mt-4">
              <img
                src="/Images/certified tech.png"
                alt="Quality Service"
                className="w-full h-auto"
              />
            </div>

            <div className="px-4 sm:px-6 py-4 text-center">
              <div className="font-bold text-lg sm:text-xl mb-2 italic">
                Quality Service
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="max-w-sm w-full rounded overflow-hidden shadow-lg m-2 sm:m-3 md:m-4"
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView={"show"}
          >
            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center mx-auto mt-4">
              <img
                src="/Images/certified tech.png"
                alt="Professional Tools"
                className="w-full h-auto"
              />
            </div>

            <div className="px-4 sm:px-6 py-4 text-center">
              <div className="font-bold text-lg sm:text-xl mb-2 italic">
                Professional Tools
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
