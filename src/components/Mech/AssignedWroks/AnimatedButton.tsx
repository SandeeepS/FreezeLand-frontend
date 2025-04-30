import React from "react";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const AnimatedButton: React.FC = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:bg-gray-800"
    >
      <motion.span
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowForwardIcon fontSize="small" />
      </motion.span>
      SHOW MORE
    </motion.button>
  );
};

export default AnimatedButton;
