import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi"; // Added the loading spinner icon

const FileUploadForm = ({ onUpload, loading }) => {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [passkey, setPasskey] = useState('');

    // Passkey validation regex
    const passkeyRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const onFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    const onPasskeyChange = (e) => {
        setPasskey(e.target.value);
    };

    const onUploadSubmit = (e) => {
        e.preventDefault();

        if (!fileToUpload || !passkey) {
            alert('Please select a file and enter a passkey.');
            return;
        }

        if (!passkeyRegex.test(passkey)) {
            alert(
                'Passkey must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
            );
            return;
        }

        onUpload(fileToUpload, passkey);

        setFileToUpload(null);
        setPasskey('');
    };

    return (
        <form
            onSubmit={onUploadSubmit}
            className="flex flex-col gap-4 bg-gray-900 p-6 rounded-lg border border-gray-700/50 max-w-md mx-auto"
        >
            <input
                type="file"
                onChange={onFileChange}
                required
                className="text-gray-300 file:bg-red-600 file:text-white file:font-semibold file:py-2 file:px-4 file:rounded-lg file:border-0 file:cursor-pointer file:hover:bg-red-700 transition-colors file:transition-colors"
            />
            <input
                type="password"
                placeholder="Enter passkey (min 8 chars, incl. uppercase, number, and special char)"
                value={passkey}
                onChange={onPasskeyChange}
                required
                className="rounded-md border border-gray-700 bg-gray-800 text-white p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <motion.button
                type="submit"
                disabled={loading}
                // Added 'relative' to position the spinner
                className="relative bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
            >
                {/* Spinner */}
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <FiLoader className="animate-spin" size={20} />
                    </div>
                )}
                {/* Text (hidden when loading) */}
                <span className={loading ? 'opacity-0' : 'opacity-100'}>
                    Upload
                </span>
            </motion.button>
        </form>
    );
};

export default FileUploadForm;