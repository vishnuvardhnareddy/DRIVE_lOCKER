import { useContext } from "react";
import CustomButton from "../Util/Button";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
// Replaced Fa icons with Fi for consistency
import { FiFileText, FiHardDrive } from "react-icons/fi";
import { motion } from "framer-motion";

const Services = () => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    return (
        <motion.div
            className="bg-gray-950/80 shadow-2xl rounded-2xl p-10 max-w-4xl mx-auto border border-gray-800 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold text-gray-200 mb-12 text-center">
                <span className="text-red-600">DriveLocker</span> Features
            </h1>

            <div className="flex flex-col sm:flex-row gap-12 justify-center">
                {/* Notes Service Card */}
                <motion.div
                    className="bg-gray-800/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full cursor-pointer border border-gray-700/50 hover:shadow-red-600/30 hover:scale-[1.03] transition-all duration-300"
                    onClick={() => navigate("/Notes")}
                    whileHover={{ scale: 1.05 }}
                >
                    <FiFileText className="text-red-500 mb-5" size={60} />
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">
                        Create and Manage Your Notes
                    </h2>
                    <p className="text-gray-300 mb-8 text-center px-2">
                        A powerful tool for organizing your thoughts, ideas, and reminders.
                    </p>
                    <CustomButton
                        text="Use Notes"
                        handleOnclick={() => navigate("/Notes")}
                        className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-lg font-semibold shadow-lg transition-colors"
                    />
                </motion.div>

                {/* File Storage Service Card */}
                <motion.div
                    className="bg-gray-800/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full cursor-pointer border border-gray-700/50 hover:shadow-red-600/30 hover:scale-[1.03] transition-all duration-300"
                    onClick={() =>
                        navigate(userData.hasPasskey ? "/Files" : "/Createpasskey")
                    }
                    whileHover={{ scale: 1.05 }}
                >
                    <FiHardDrive className="text-red-500 mb-5" size={60} />
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">
                        Personalized File Storage
                    </h2>
                    <p className="text-gray-300 mb-8 text-center px-2">
                        Securely store and access your files from anywhere, with custom
                        passkey protection.
                    </p>
                    <CustomButton
                        text="Use Files"
                        handleOnclick={() =>
                            navigate(userData.hasPasskey ? "/Files" : "/Createpasskey")
                        }
                        className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-lg font-semibold shadow-lg transition-colors"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Services;