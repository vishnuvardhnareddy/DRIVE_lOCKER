import React from 'react';
import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi'; // Added icon

const FileActions = ({ files, selectedFiles, onSelectAllChange, onDeleteSelected, loading }) => {
    const allSelected = selectedFiles.length === files.length && files.length > 0;

    return (
        <div className="flex justify-between items-center mb-4 bg-gray-900/90 backdrop-blur-md p-4 rounded-lg border border-gray-800 shadow-md">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="selectAll"
                    checked={allSelected}
                    onChange={onSelectAllChange}
                    // Replaced accent-cyan with the consistent red styled checkbox
                    className="h-5 w-5 text-red-600 bg-gray-800 rounded border-gray-700 focus:ring-red-500 focus:ring-2 cursor-pointer transition"
                />
                <label
                    htmlFor="selectAll"
                    className="ml-3 text-gray-300 select-none cursor-pointer"
                >
                    Select All
                </label>
            </div>
            <motion.button
                onClick={onDeleteSelected}
                disabled={selectedFiles.length === 0 || loading}
                // Updated disabled style and added flex/gap for icon
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${selectedFiles.length === 0 || loading
                        ? 'bg-red-800 opacity-70 cursor-not-allowed' // Darker disabled red
                        : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                    } text-white`}
                // Added motion props, conditional on not being disabled
                whileHover={!(selectedFiles.length === 0 || loading) ? { scale: 1.05 } : {}}
                whileTap={!(selectedFiles.length === 0 || loading) ? { scale: 0.95 } : {}}
            >
                <FiTrash2 size={16} />
                <span>Delete Selected ({selectedFiles.length})</span>
            </motion.button>
        </div>
    );
};

export default FileActions;