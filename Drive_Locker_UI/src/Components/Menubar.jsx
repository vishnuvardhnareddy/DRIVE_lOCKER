import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FiLogIn,
    FiMenu,
    FiX,
    FiLogOut,
    FiMail,
    FiGrid,
    FiFileText,
    FiHardDrive,
    FiKey,
} from "react-icons/fi";
import { motion } from "framer-motion";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { BackendURL, setIsLoggedin, setUserData, userData } =
        useContext(AppContext);

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`);
            if (res.status === 200) {
                navigate("/email-verify");
                toast.success("OTP sent successfully");
            } else {
                toast.error("Unable to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post(
                `${BackendURL}/auth/logout`,
                {},
                { withCredentials: true }
            );
            if (res.status === 200) {
                setIsLoggedin(false);
                setUserData(false);
                toast.success("Logged out successfully");
                navigate("/login");
            } else {
                toast.error("Logout failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    // --- Navigation Items ---
    const navItems = [
        { label: "Features", path: "/Features", icon: <FiGrid size={18} /> },
        { label: "Notes", path: "/Notes", icon: <FiFileText size={18} /> },
        { label: "Files", path: "/Files", icon: <FiHardDrive size={18} /> },
    ];

    if (userData && !userData.hasPasskey) {
        navItems.push({
            label: "Create Passkey",
            path: "/CreatePasskey",
            icon: <FiKey size={18} />,
        });
    }

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 lg:px-16 py-4 md:py-5 shadow-lg bg-black/70 backdrop-blur-sm border-b border-gray-800">
            {/* Logo and Brand Name */}
            <div
                className="flex items-center space-x-3 md:space-x-4 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <motion.img
                    src={assets.home}
                    alt="Drivelocker Logo"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full transition-transform" // CHANGED: Increased size (h-10 w-10 md:h-12 md:w-12) and changed shape to rounded-full
                    whileHover={{ scale: 1.1, rotate: 10 }}
                />
                <span className="text-2xl md:text-3xl font-bold text-red-600 select-none">
                    DriveLocker
                </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-6 md:space-x-8">
                {userData && navItems.map((item) => (
                    <motion.button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`relative text-md md:text-lg font-medium transition-colors ${location.pathname === item.path
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {item.label}
                        {location.pathname === item.path && (
                            <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600"
                                layoutId="underline"
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">
                {userData ? (
                    <>
                        {!userData.isAccountVerified && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={sendVerificationOtp}
                                className="flex items-center gap-2 px-4 py-2 text-sm md:text-md font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                <FiMail size={16} />
                                <span>Verify Email</span>
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm md:text-md font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                        >
                            <FiLogOut size={16} />
                            <span>Logout</span>
                        </motion.button>
                    </>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogin}
                        className="flex items-center justify-center gap-2 px-5 py-2 text-sm md:text-md font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        <FiLogIn size={18} />
                        <span className="font-medium">Login</span>
                    </motion.button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
                <motion.button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-300 hover:text-white z-50"
                    aria-label="Toggle menu"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </motion.button>
            </div>

            {/* Mobile Collapsible Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-0 left-0 w-full h-screen bg-black pt-24 p-6 md:hidden flex flex-col items-center space-y-4"
                >
                    {userData && navItems.map((item) => (
                        <motion.button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                setIsMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-6 py-3 text-lg font-medium rounded-md ${location.pathname === item.path
                                    ? "text-white bg-gray-800"
                                    : "text-gray-300 hover:bg-gray-800"
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </motion.button>
                    ))}
                    <div className="pt-6 w-full space-y-4">
                        {/* Mobile Auth Actions */}
                        {userData ? (
                            <>
                                {!userData.isAccountVerified && (
                                    <motion.button
                                        onClick={() => {
                                            sendVerificationOtp();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-3 w-full px-6 py-3 text-lg font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                    >
                                        <FiMail size={18} />
                                        <span>Verify Email</span>
                                    </motion.button>
                                )}
                                <motion.button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-3 w-full px-6 py-3 text-lg font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-md"
                                >
                                    <FiLogOut size={18} />
                                    <span>Logout</span>
                                </motion.button>
                            </>
                        ) : (
                            <motion.button
                                onClick={() => {
                                    handleLogin();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-3 w-full px-6 py-3 text-lg font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                            >
                                <FiLogIn size={18} />
                                <span className="font-medium">Login</span>
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Menubar;