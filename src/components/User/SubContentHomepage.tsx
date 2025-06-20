import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

function SubContentHomepage() {
  return (
    <>
      <div className="bg-slate-100  w-full md:flex">
        <motion.div
          className=" md:flex-grow"
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
        >
          <div className=" pt-20 flex flex-col justify-center items-center sm:pl-12 sm:flex-none">
            <h1 className="text-5xl">
              YOUR
              <span className="text-freeze-color font-Metal italic">
                DREAMS
              </span>
            </h1>
            <h1 className="text-5xl">
              OUR
              <span className="text-freeze-color font-Metal italic">
                EXPERTISE
              </span>
            </h1>
          </div>
          <div className="pt-12  flex flex-col justify-center items-center sm:pl-12 sm:flex-none ">
            <h6>
              in the Montreal area, we provide a full-service interior <br></br>
              {""}
              design and turnkey renovation solution. We handle every <br></br>
              {""}
              stage, from initial design to final completion, ensuring the{""}
              <br></br> creation of harmonious and functional interiors.
            </h6>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          className="smallPictureBox justify-end items-center  "
        >
          <div className="p-8  h-50 w-[800px]  mr-20 ">
            <img src="/Images/acWall3.jpg" alt="" />
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SubContentHomepage;
