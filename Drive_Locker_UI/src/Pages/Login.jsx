import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

// Icons
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
    const [isCreateAccount, setCreateAccount] = useState(false);
    const [formData, setFormData] = useState({});
    const { BackendURL, setIsLoggedin, getUserdata } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);

        try {
            if (isCreateAccount) {
                const res = await axios.post(`${BackendURL}/user/register`, formData);
                if (res.status === 201) {
                    setCreateAccount(false);
                    toast.success("Account created successfully");
                } else {
                    toast.error(res.message);
                }
            } else {
                const res = await axios.post(`${BackendURL}/auth/login`, formData);
                if (res.status === 200) {
                    setIsLoggedin(true);
                    toast.success("Login success");
                    await getUserdata();
                    navigate("/");
                } else {
                    toast.error("Unable to login");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 bg-transparent min-h-screen font-[Inter] w-full">
            {/* Login Card */}
            <div className="w-1/3 bg-black/85 rounded-2xl shadow-2xl p-12 backdrop-blur-md text-white min-h-[400px] flex flex-col justify-center">
                <h1 className="text-5xl font-bold mb-10 text-center text-red-600 drop-shadow-lg ">
                    {isCreateAccount ? "Sign Up" : "Sign In"}
                </h1>

                {loading && (
                    <p className="text-center text-red-500 mb-6 animate-pulse">Loading...</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Name Field (Sign Up only) */}
                    {isCreateAccount && (
                        <div className="flex items-center bg-neutral-900 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-600">
                            <FiUser className="text-gray-400 text-xl mr-3" />
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-transparent outline-none text-white text-lg placeholder-gray-400"
                                onChange={handleForm}
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="flex items-center bg-neutral-900 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-600">
                        <MdOutlineEmail className="text-gray-400 text-xl mr-3" />
                        <input
                            type="email"
                            name="email"
                            className="w-full bg-transparent outline-none text-white text-lg placeholder-gray-400"
                            onChange={handleForm}
                            placeholder="Email or mobile number"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex items-center bg-neutral-900 rounded-lg px-4 py-3 relative focus-within:ring-2 focus-within:ring-red-600">
                        <RiLockPasswordLine className="text-gray-400 text-xl mr-3" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full bg-transparent outline-none text-white text-lg placeholder-gray-400"
                            onChange={handleForm}
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 text-gray-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 transition rounded-md py-4 text-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {isCreateAccount ? "Create Account" : "Sign In"}
                    </button>

                    {/* Forgot Password (only for login) */}
                    {!isCreateAccount && (
                        <div className="text-center">
                            <Link
                                to="/reset-password"
                                className="text-gray-300 text-lg hover:underline "
                            >
                                Forgot password?
                            </Link>
                        </div>
                    )}
                </form>

                {/* Remember Me */}
                <div className="mt-6">
                    <label className="flex items-center text-lg text-gray-300">
                        <input type="checkbox" className="mr-2 accent-red-600" /> Remember me
                    </label>
                </div>

                {/* Switch Auth Mode */}
                <div className="mt-6 text-lg text-gray-400 text-center">
                    {isCreateAccount ? (
                        <p>
                            Already have an account?{" "}
                            <button
                                onClick={() => setCreateAccount(false)}
                                className="text-white hover:underline"
                            >
                                Sign in now.
                            </button>
                        </p>
                    ) : (
                        <p>
                            New here?{" "}
                            <button
                                onClick={() => setCreateAccount(true)}
                                className="text-white hover:underline font-medium"
                            >
                                Sign up now.
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
