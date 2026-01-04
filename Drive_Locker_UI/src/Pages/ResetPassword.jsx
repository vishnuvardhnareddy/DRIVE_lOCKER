import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
// Replaced all icons with the consistent Feather icon set
import { FiLock, FiMail, FiKey, FiLoader, FiCheckCircle, FiSend } from "react-icons/fi";

const OTP_LENGTH = 6;

const ResetPassword = () => {
    const { BackendURL } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [otpStr, setOtpStr] = useState("");
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [isPasswordStep, setIsPasswordStep] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [password, setPassword] = useState("");
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isOtpStep && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [isOtpStep]);

    const handleOtpChange = (e, idx) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newOtp = [...otp];
            newOtp[idx] = val;
            setOtp(newOtp);
            if (val !== "" && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH).split("");
        const validPasted = pasted.filter((d) => /^[0-9]$/.test(d));
        const filledOtp = Array(OTP_LENGTH).fill("");
        validPasted.forEach((digit, i) => (filledOtp[i] = digit));
        setOtp(filledOtp);
        const nextIndex = validPasted.length === OTP_LENGTH ? OTP_LENGTH - 1 : validPasted.length;
        if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === "Backspace" && otp[idx] === "" && idx > 0) inputRefs.current[idx - 1].focus();
    };

    axios.defaults.withCredentials = true;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.warn("Please enter your email address.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BackendURL}/auth/send-reset-otp?email=${email}`);
            if (res.status === 200) {
                setIsOtpStep(true);
                toast.success("OTP sent to your email!");
            } else {
                toast.error(res.data?.message || "Failed to send OTP. Please try again.");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send OTP. Please check the email and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const str = otp.join("");
        if (str.length !== OTP_LENGTH) {
            toast.error("Please enter the complete 6-digit OTP.");
            return;
        }
        setOtpStr(str);
        setIsOtpStep(false);
        setIsPasswordStep(true);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            toast.warn("Your new password must be at least 6 characters long.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BackendURL}/auth/reset-password`, {
                email,
                otp: otpStr,
                newPassword: password,
            });
            if (res.status === 200) {
                setIsSuccess(true);
                toast.success("Password reset successfully! Redirecting...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                toast.error("Password reset failed. Please try again.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Password reset failed.");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (isSuccess) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 text-center">
                    <FiCheckCircle className="text-green-500" size={52} />
                    <p className="text-lg font-medium text-gray-200">Password Reset Successful</p>
                    <p className="text-gray-400">You will be redirected to the login page shortly.</p>
                    <motion.button
                        onClick={() => navigate("/login")}
                        className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Go to Login
                    </motion.button>
                </motion.div>
            );
        }
        if (isPasswordStep) {
            return (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">New Password</label>
                        <div className="relative flex items-center">
                            <FiKey className="absolute left-3 text-gray-500" size={20} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>
                    <motion.button type="submit" disabled={loading} className="relative w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed" whileHover={!loading ? { scale: 1.05 } : {}} whileTap={!loading ? { scale: 0.95 } : {}}>
                        {loading && <div className="absolute inset-0 flex justify-center items-center"><FiLoader className="animate-spin" size={20} /></div>}
                        <span className={loading ? 'opacity-0' : 'opacity-100'}>Reset Password</span>
                    </motion.button>
                </motion.form>
            );
        }
        if (isOtpStep) {
            return (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleOtpSubmit} className="space-y-6">
                    <p className="text-gray-400 text-center">Enter the 6-digit code sent to <span className="font-semibold text-gray-200">{email}</span></p>
                    <div className="flex justify-center gap-2 sm:gap-3">
                        {otp.map((digit, idx) => (
                            <input key={idx} ref={(el) => (inputRefs.current[idx] = el)} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e, idx)} onKeyDown={(e) => handleOtpKeyDown(e, idx)} onPaste={handleOtpPaste} disabled={loading} className="w-12 h-12 text-center border-2 border-gray-700 focus:border-red-500 rounded-lg text-xl focus:outline-none bg-gray-800 text-white transition focus:ring-2 focus:ring-red-500" />
                        ))}
                    </div>
                    <motion.button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Continue
                    </motion.button>
                </motion.form>
            );
        }
        return (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSendOtp} className="space-y-6">
                <div>
                    <label className="block text-gray-300 mb-2 font-medium">Registered Email Address</label>
                    <div className="relative flex items-center">
                        <FiMail className="absolute left-3 text-gray-500" size={20} />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="your.email@example.com" autoFocus />
                    </div>
                </div>
                <motion.button type="submit" disabled={loading} className="relative w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed" whileHover={!loading ? { scale: 1.05 } : {}} whileTap={!loading ? { scale: 0.95 } : {}}>
                    {loading && <div className="absolute inset-0 flex justify-center items-center"><FiLoader className="animate-spin" size={20} /></div>}
                    <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <FiSend size={18} /> Send OTP
                    </span>
                </motion.button>
            </motion.form>
        );
    };

    return (
        <div className="flex items-center justify-center px-4  w-full">
            <motion.div
                className="w-full max-w-lg bg-gray-950/80 shadow-2xl rounded-xl px-6 py-12 flex flex-col gap-6 border border-gray-800 backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-600 flex items-center gap-3 justify-center">
                        <FiLock size={28} /> Reset Password
                    </h2>
                </div>
                {renderContent()}
            </motion.div>
        </div>
    );
};

export default ResetPassword;