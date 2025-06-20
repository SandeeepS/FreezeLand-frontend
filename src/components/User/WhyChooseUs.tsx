import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

const WhyChooseUs: React.FC = () => {
  return (
    <div>
      <div className="bg-slate-100 flex flex-col ">
        <motion.div
          className="flex items-center justify-center pt-10"
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
        >
          <h1 className="font-bold text-5xl">Why Choose US?</h1>
        </motion.div>

        <motion.div
          className=" items-center justify-center text-center italic mt-5"
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
        >
          <p>
            As a prominent name in the repair industry, we provide best-in-class
            AC repair and service with our highly-skilled
          </p>
          <p>technicians, quality parts, and latest tools & technologies</p>
        </motion.div>

        <div className="flex m-14  flex-col md:flex-row md:items-center md:justify-center">
          <motion.div
            className="max-w-sm rounded overflow-hidden shadow-lg m-4"
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView={"show"}
          >
            <div className="w-40 h-40 flex items-center justify-center mx-auto">
              <img
                src="/Images/certified tech.png"
                alt="Example image"
                className="w-full h-auto"
              />
            </div>

            <div className="px-6 py-4 text-center">
              <div className="font-bold text-xl mb-2 italic">
                Certified Technicians
              </div>
              <p className="text-gray-700 text-base">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </motion.div>

          <motion.div
            className="max-w-sm rounded overflow-hidden shadow-lg m-4"
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView={"show"}
          >
            <div className="w-40 h-40 flex items-center justify-center mx-auto">
              <img
                src="/Images/certified tech.png"
                alt="Example image"
                className="w-full h-auto"
              />
            </div>

            <div className="px-6 py-4 text-center">
              <div className="font-bold text-xl mb-2 italic">
                Certified Technicians
              </div>
              <p className="text-gray-700 text-base">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </motion.div>

          <motion.div
            className="max-w-sm rounded overflow-hidden shadow-lg m-4"
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView={"show"}
          >
            <div className="w-40 h-40 flex items-center justify-center mx-auto">
              <img
                src="/Images/certified tech.png"
                alt="Example image"
                className="w-full h-auto"
              />
            </div>

            <div className="px-6 py-4 text-center">
              <div className="font-bold text-xl mb-2 italic">
                Certified Technicians
              </div>
              <p className="text-gray-700 text-base">
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
