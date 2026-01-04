import { createContext, useState, useContext, useEffect } from 'react';
import FileService from "../services/FileService";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from './AppContext';
import { AppConstants } from "../Util/constants";
// Create a context
const FileContext = createContext();

export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
    const BackendURL = AppConstants.BACKEND_URL;
    const { userData } = useContext(AppContext);

    useEffect(() => {
        // Only fetch if userData has loaded and there is a user
        if (userData) {
            fetchUserFiles();
        }
    }, [userData]); // Add userData to the dependency array
    // Check if userData and hasPasskey exist before accessing.
    // This is important to prevent errors if userData is not yet loaded.
    const hasPasskey = userData ? userData.hasPasskey : null;

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    // Centralized check for passkey
    const checkPasskeyAndRedirect = () => {
        if (hasPasskey === false) {
            toast.info("Please create a passkey to use this service.");
            navigate("/CreatePasskey");
            return true; // Indicates a redirection occurred
        }
        return false; // Indicates no redirection needed
    };

    const fetchUserFiles = async () => {
        if (checkPasskeyAndRedirect()) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await FileService.getUserFiles();
            setFiles(data);
        } catch (err) {
            console.log(err);

            if (err.status === 401) {
                toast.info("Please verify your email to use this service");
                await sendVerificationOtp();
            }
            setError(err.response?.data?.message || "Failed to fetch files");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file, passkey) => {
        if (checkPasskeyAndRedirect()) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await FileService.fileUpload(file, passkey);
            await fetchUserFiles();
            return response;
        } catch (err) {
            if (err.status === 401) {
                toast.info("Please verify your email to use this service");
                await sendVerificationOtp();
            }
            setError(err.response?.data?.message || "File upload failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFiles = async (publicIds) => {
        if (checkPasskeyAndRedirect()) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await FileService.deleteFiles(publicIds);
            setFiles(currentFiles =>
                currentFiles.filter(file => !publicIds.includes(file.publicId))
            );
            toast.success(response.message || "Files deleted successfully.");
            return response;
        } catch (err) {
            // Corrected error handling
            setError(err.response?.data?.message || "File deletion failed");
            toast.error(err.response?.data?.message || "File deletion failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Re-added the useEffect hook to fetch files on component mount
    useEffect(() => {
        // Only fetch if userData has loaded and there is a user
        if (userData) {
            fetchUserFiles();
        }
    }, [userData]); // Add userData to the dependency array

    const value = {
        files,
        loading,
        error,
        fetchUserFiles,
        handleFileUpload,
        handleDeleteFiles,
    };

    return (
        <FileContext.Provider value={value}>
            {children}
        </FileContext.Provider>
    );
};