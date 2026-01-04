import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiDownloadCloud } from "react-icons/fi"; // Added icons

const FileListItem = ({ file, isSelected, onFileSelect }) => {
    const handleDownload = async () => {
        try {
            // Fetch the file data as a blob
            const response = await fetch(file.fileUrl);
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(new Blob([blob]));

            // Create a hidden anchor tag to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.fileName);
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up: remove the link and revoke the URL
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download the file.');
        }
    };

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            // Added conditional red border for selection and hover/glass effect
            className={`border rounded-lg mb-4 p-4 bg-gray-900/90 text-gray-300 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-gray-800 ${isSelected ? 'border-red-600 shadow-red-600/20' : 'border-gray-800'}`}
        >
            <div className="flex items-start space-x-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onFileSelect(file.publicId)}
                    // Used the same styled checkbox from Note.jsx for consistency
                    className="h-5 w-5 text-red-600 bg-gray-800 rounded border-gray-700 focus:ring-red-500 focus:ring-2 cursor-pointer transition flex-shrink-0 mt-1"
                />
                <div className="flex flex-col flex-grow overflow-hidden">
                    <p className="truncate">
                        <strong className="text-gray-100 font-semibold">File Name:</strong> {file.fileName}
                    </p>
                    <p>
                        <strong className="text-gray-100 font-semibold">File Type:</strong> {file.fileType}
                    </p>
                    <p>
                        <strong className="text-gray-100 font-semibold">Uploaded At:</strong>{' '}
                        {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                        {/* View File Link - now red with icon */}
                        <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-red-500 font-medium hover:text-red-400 hover:underline transition-colors"
                        >
                            <FiExternalLink size={16} />
                            View File
                        </a>

                        {/* Download Button - now red with icon */}
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1 text-red-500 font-medium hover:text-red-400 hover:underline bg-transparent border-0 p-0 cursor-pointer transition-colors"
                            aria-label={`Download ${file.fileName}`}
                            type="button"
                        >
                            <FiDownloadCloud size={16} />
                            Download File
                        </button>
                    </div>
                </div>
            </div>
        </motion.li>
    );
};

export default FileListItem;