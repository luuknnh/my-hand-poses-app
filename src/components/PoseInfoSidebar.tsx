import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PoseInfoSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
    collapsed: {
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const listItemVariants = {
    initial: { y: 20, opacity: 0 },
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-end z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 text-xl rounded-full bg-orange-500 p-4 text-white shadow-lg hover:bg-orange-600 transition-colors duration-200 ease-in-out"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? "Close Info" : "Show Poses"}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={sidebarVariants}
            className="bg-white rounded-lg shadow-xl p-6 mt-2 w-80"
          >
            <motion.h4 className="text-lg font-semibold text-gray-800">
              Dragon Ball Z Poses
            </motion.h4>
            <motion.p className="text-gray-600 mt-2">
              Try to mimic these iconic Dragon Ball Z character poses:
            </motion.p>
            <motion.ul>
              {["Freezer/Frieza", "Goku", "Trunks", "Vegeta"].map(
                (pose, index) => (
                  <motion.li
                    key={pose}
                    variants={listItemVariants}
                    initial="initial"
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.3,
                        delay: index * 0.1,
                      },
                    }}
                    exit={{
                      y: 20,
                      opacity: 0,
                      transition: { duration: 0.2, delay: index * 0.1 },
                    }}
                  >
                    {pose}
                  </motion.li>
                )
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PoseInfoSidebar;
