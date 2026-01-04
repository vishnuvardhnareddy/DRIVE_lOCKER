import assets from "../assets/assets";
// 1. Replaced FaHandPeace with FiSmile for consistency
import { FiSmile } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// 2. Added motion for the button
import { motion } from "framer-motion";

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    // 3. Made container consistent with other pages
    <div className="w-full max-w-[700px] mx-auto
            flex flex-col items-center gap-12
            px-10 py-14
            bg-gray-950/80 backdrop-blur-md
            rounded-2xl shadow-2xl
            border border-gray-800
            transition-all duration-300 ease-in-out
            hover:scale-[1.01] hover:shadow-2xl hover:shadow-red-600/20
        ">
      {/* Illustration */}
      <div className="flex justify-center items-center">
        <img
          src={assets.header}
          alt="Header Visual"
          className="w-52 h-52 object-contain rounded-xl shadow-xl bg-gray-900/50 p-4 border border-gray-800"
        />
      </div>

      {/* Welcome Text */}
      <div className="flex flex-col items-center text-center w-full">
        <div className="flex items-center gap-3 mb-5">
          <h5 className="text-xl font-medium text-gray-200">
            Hey {userData ? userData.name : "developer"}
          </h5>
          {/* 4. Swapped icon and color */}
          <FiSmile className="text-2xl text-red-600" title="Hello" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white">
          Welcome to DriveLocker
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-md leading-relaxed">
          Secure your files. Organize your notes. All in one place.
        </p>
        {/* 5. Replaced CustomButton with motion.button for animation */}
        <motion.button
          onClick={() => { navigate("/features"); }}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 rounded-lg shadow-lg transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default Header;