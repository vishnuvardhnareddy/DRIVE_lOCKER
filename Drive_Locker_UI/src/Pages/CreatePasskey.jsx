import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
// Replaced all icons with the consistent Feather icon set
import { FiLock, FiKey, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const CreatePasskey = () => {
    const { BackendURL, userData, getUserdata } = useContext(AppContext);
    const navigate = useNavigate();

    const [passkey, setPasskey] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (userData && userData.hasPasskey) {
            navigate("/Files");
        }
    }, [userData, navigate]);

    const createKey = async () => {
        if (!userData) {
            setError("User data not available. Please log in again.");
            return;
        }
        if (userData.hasPasskey) {
            navigate("/");
            return;
        }

        setMessage("");
        setError("");

        const passkeyRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passkeyRegex.test(passkey)) {
            setError(
                "Passkey must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
            );
            return;
        }

        try {
            const response = await axios.post(`${BackendURL}/user/add-passkey`, {
                passKey: passkey,
            });

            toast.success(response.data.message || "Passkey set successfully!");
            setMessage(response.data.message || "Passkey set successfully!");
            setPasskey("");

            await getUserdata();
            navigate("/Files");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "An error occurred while setting the passkey."
            );
        }
    };

    return (
        <motion.div
            className="bg-gray-950/80 shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto border border-gray-800 backdrop-blur-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Title */}
            <div className="flex items-center justify-center mb-6 space-x-3">
                <FiLock className="text-red-500 text-3xl" />
                <h1 className="text-3xl font-bold text-gray-200">Create Passkey</h1>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-6 text-center">
                Your passkey secures your files. It must be at least{" "}
                <span className="font-semibold text-gray-300">8 characters</span> and include an
                uppercase, lowercase, number, and special character.
            </p>

            {/* Input */}
            <div className="relative mb-4">
                <FiKey className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <motion.input
                    type="password"
                    placeholder="Enter your new passkey"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                />
            </div>

            {/* Button */}
            <motion.button
                onClick={createKey}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiKey size={18} />
                <span>Set Passkey</span>
            </motion.button>

            {/* Success Message */}
            {message && (
                <motion.p
                    className="mt-4 flex items-center justify-center text-green-400 text-sm font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <FiCheckCircle className="mr-2" size={18} /> {message}
                </motion.p>
            )}

            {/* Error Message */}
            {error && (
                <motion.p
                    className="mt-4 flex items-center text-center justify-center text-red-400 text-sm font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <FiAlertCircle className="mr-2 flex-shrink-0" size={18} /> {error}
                </motion.p>
            )}
        </motion.div>
    );
};

export default CreatePasskey;