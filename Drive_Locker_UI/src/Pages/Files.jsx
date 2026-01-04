import { useState } from 'react';
import { useFiles } from '../context/FileContext';
import FileActions from '../Components/FileActions';
import FileListItem from '../Components/FileListItem';
import UploadModal from '../Components/UploadModal';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
// Changed icons for consistency
import { FiTrash2, FiUploadCloud } from 'react-icons/fi';

const Files = () => {
    const {
        files,
        loading,
        error,
        handleFileUpload,
        handleDeleteFiles
    } = useFiles();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFileSelect = (publicId) => {
        setSelectedFiles((prevSelected) =>
            prevSelected.includes(publicId)
                ? prevSelected.filter((id) => id !== publicId)
                : [...prevSelected, publicId]
        );
    };

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            const allPublicIds = files.map((file) => file.publicId);
            setSelectedFiles(allPublicIds);
        } else {
            setSelectedFiles([]);
        }
    };

    const onDeleteSelected = () => {
        if (selectedFiles.length === 0) return;
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        try {
            await handleDeleteFiles(selectedFiles);
            toast.success('Files deleted successfully!');
            setSelectedFiles([]);
        } catch (err) {
            toast.error(`Deletion failed: ${err.message || err}`);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleUpload = async (file, passkey) => {
        try {
            await handleFileUpload(file, passkey);
            toast.success('File uploaded successfully!');
            setIsModalOpen(false);
        } catch (err) {
            toast.error(`Upload failed: ${err.message || err}`);
        }
    };

    return (
        <motion.div
            className="bg-gray-950/80 shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-4xl mx-auto border border-gray-800 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-extrabold text-gray-200 border-b-2 border-red-600/50 pb-3 w-full sm:w-auto">
                    Your Files
                </h1>
                <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors duration-200 w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiUploadCloud size={18} />
                    <span>Upload File</span>
                </motion.button>
            </div>

            {loading && (
                <p className="text-gray-300 text-center mb-4">Loading files...</p>
            )}
            {error && (
                <p className="text-red-500 text-center mb-4">
                    Error: {error.toString()}
                </p>
            )}

            <hr className="border-gray-800 mb-4" />

            <h2 className="text-2xl font-bold text-gray-200 mb-3">My Files</h2>
            {files.length > 0 && !loading && (
                <FileActions
                    files={files}
                    selectedFiles={selectedFiles}
                    onSelectAllChange={handleSelectAllChange}
                    onDeleteSelected={onDeleteSelected}
                    loading={loading}
                />
            )}

            {files.length === 0 && !loading ? (
                <p className="text-gray-400 text-center py-10 text-lg">
                    You have no files. Upload one to get started!
                </p>
            ) : (
                <ul className="list-none p-0">
                    {files.map((file) => (
                        <FileListItem
                            key={file.publicId}
                            file={file}
                            isSelected={selectedFiles.includes(file.publicId)}
                            onFileSelect={handleFileSelect}
                        />
                    ))}
                </ul>
            )}

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpload={handleUpload}
                loading={loading}
            />

            {/* Custom Confirmation Pop-up */}
            {showConfirm && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-70 z-50"
                        onClick={handleCancelDelete}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                    {/* Confirmation Modal */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 z-[51] -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl shadow-lg p-8 text-center border border-gray-700/50 min-w-[300px]"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FiTrash2 className="mx-auto mb-4 text-red-500" size={40} />
                        <p className="text-gray-200 mb-6">
                            Are you sure you want to delete{' '}
                            <span className="font-bold text-red-400">
                                {selectedFiles.length}
                            </span>{' '}
                            file(s)?
                        </p>
                        <div className="flex justify-center gap-4">
                            <motion.button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Yes, delete
                            </motion.button>
                            <motion.button
                                onClick={handleCancelDelete}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                No, cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};

export default Files;