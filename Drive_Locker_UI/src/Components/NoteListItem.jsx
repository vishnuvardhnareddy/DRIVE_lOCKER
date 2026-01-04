import React from 'react';
import { FaEdit, FaStar } from "react-icons/fa";
import { motion } from "framer-motion"; // Added framer-motion for a nice entry animation

const Note = ({ ele, onUpdateClick, onSelectChange, isSelected, select }) => {
    return (
        <motion.div
            layout // Animates layout changes (like the checkbox appearing)
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`
        flex items-center bg-gray-900/90 p-4 my-2 rounded-lg shadow-2xl 
        backdrop-blur-md transition-all duration-300 hover:bg-gray-800
        border ${isSelected ? 'border-red-600 shadow-red-600/20' : 'border-gray-800'}
      `}
        >
            {select && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelectChange}
                        className="
              h-5 w-5 text-red-600 bg-gray-800 rounded border-gray-700 
              focus:ring-red-500 focus:ring-2 cursor-pointer transition
              flex-shrink-0
            "
                    />
                </motion.div>
            )}

            {/* Added overflow-hidden to make truncate work */}
            <div className={`flex-grow overflow-hidden ${select ? 'ml-4' : 'ml-0'}`}>
                <h4 className="flex items-center text-lg font-semibold text-gray-200 truncate">
                    {ele.title}

                    {/* Kept star yellow as it's a status, not an action */}
                    {ele.isFavourate && (
                        <FaStar className="ml-2 text-yellow-400 flex-shrink-0" title="Favourite" />
                    )}
                </h4>
                <p className="text-sm text-gray-400 truncate">{ele.notes}</p>
            </div>

            <button
                onClick={onUpdateClick}
                className="
          p-2 ml-4 text-gray-400 hover:text-red-500 
          hover:bg-gray-700/50 rounded-full transition-colors duration-200
          flex-shrink-0
        "
                aria-label="Edit note"
                type="button"
            >
                <FaEdit size={20} />
            </button>
        </motion.div>
    );
};

export default Note;