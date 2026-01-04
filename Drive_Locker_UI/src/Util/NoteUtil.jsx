import React, { useContext, useState, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import { FaStar } from "react-icons/fa"; // Kept for the star
import { FiCheck, FiX } from "react-icons/fi"; // Added cleaner icons
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const NoteUtil = ({ note, onClose }) => {
    const isUpdateMode = !!note;

    const [formData, setFormData] = useState({
        title: isUpdateMode ? note.title : "",
        notes: isUpdateMode ? note.notes : "",
        isFavourate: isUpdateMode ? note.isFavourate : false,
    });

    const [titleError, setTitleError] = useState("");
    const { createNote, updateNote } = useContext(NotesContext);

    useEffect(() => {
        if (isUpdateMode && note) {
            setFormData({
                title: note.title,
                notes: note.notes,
                isFavourate: note.isFavourate || false,
            });
        }
    }, [note, isUpdateMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        };
        setFormData(newFormData);

        if (name === "title") {
            if (value.includes(" ")) {
                setTitleError("Title cannot contain spaces.");
            } else if (!value.trim()) {
                setTitleError("Title cannot be empty.");
            } else {
                setTitleError("");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.notes.trim()) {
            toast.warn("Title and notes cannot be empty.");
            return;
        }
        if (formData.title.includes(" ")) {
            toast.error("Title cannot contain spaces.");
            return;
        }
        if (isUpdateMode) {
            await updateNote(note.id, formData);
        } else {
            await createNote(formData);
        }
        onClose();
    };

    return (
        <motion.div
            className="bg-gray-950/90 p-6 rounded-lg shadow-2xl max-w-md mx-auto my-8 border border-gray-800 backdrop-blur-md text-gray-200"
            initial={{ opacity: 0, scale: 0.98, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
        >
            <h3 className="text-2xl font-bold mb-4 text-red-600">
                {isUpdateMode ? "Update Note" : "Create New Note"}
            </h3>
            <form onSubmit={handleSubmit}>
                {/* --- Title Input --- */}
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-800 text-white"
                    />
                    {titleError && (
                        <p className="text-red-500 text-sm mt-1">{titleError}</p>
                    )}
                </div>
                {/* --- Notes Input --- */}
                <div className="mb-4">
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32 resize-none bg-gray-800 text-white"
                    />
                </div>

                {/* --- Favourite Checkbox --- */}
                {isUpdateMode && (
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="isFavourate"
                            name="isFavourate"
                            checked={formData.isFavourate}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-400 border-gray-600 rounded focus:ring-yellow-300 cursor-pointer"
                        />
                        <label
                            htmlFor="isFavourate"
                            className="ml-2 flex items-center text-sm font-medium text-gray-300 cursor-pointer select-none"
                        >
                            <FaStar className="mr-1 text-yellow-400" />
                            Add to Favourites
                        </label>
                    </div>
                )}

                {/* --- Buttons --- */}
                <div className="flex justify-end space-x-4">
                    <motion.button
                        type="submit"
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiCheck size={18} />
                        <span>{isUpdateMode ? "Update" : "Create"}</span>
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={onClose}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiX size={18} />
                        <span>Cancel</span>
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default NoteUtil;