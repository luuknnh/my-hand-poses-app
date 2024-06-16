import { motion } from "framer-motion";
import { useAnimationContext } from "../context/AnimationContext";
import Navbar from "./common/Navbar";
import { Link } from "react-router-dom";

function Home() {
  const { routeVariants } = useAnimationContext();

  return (
    <>
      <Navbar />

      <motion.div variants={routeVariants} initial="initial" animate="final">
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white p-4">
          <h1 className="text-4xl font-bold mb-4 text-orange-500">
            Welcome to DBZ Pose Tracker!
          </h1>
          <p className="text-lg mb-8 text-orange-500">
            Discover which Dragon Ball Z character matches your pose!
          </p>
          <Link
            to="/track"
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Tracking
          </Link>
        </div>
      </motion.div>
    </>
  );
}

export default Home;
