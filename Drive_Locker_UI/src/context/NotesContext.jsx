import { createContext, useState, useCallback } from "react";
import notesService from "../services/NotesService";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppConstants } from "../Util/constants";
export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const BackendURL = AppConstants.BACKEND_URL;
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    // The handler to send OTP for email verification
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

    // A centralized error handler to check for unverified account status
    const handleGlobalApiError = useCallback(async (error) => {
        if (error.response?.status === 401) {
            toast.info("Please verify your email to use this service");
            await sendVerificationOtp();
        } else {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }, [sendVerificationOtp]);

    const fetchNotes = useCallback(async () => {
        try {
            // ✅ This is the line where the error occurs
            const fetchedNotes = await notesService.fetchNotes(BackendURL);
            setNotes(fetchedNotes);
        } catch (error) {
            console.log(error);

            handleGlobalApiError(error);
        }
    },);

    const createNote = useCallback(async (newNote) => {
        try {
            const createdNote = await notesService.createNote(BackendURL, newNote);
            setNotes(prevNotes => [...prevNotes, createdNote]);
        } catch (error) {
            handleGlobalApiError(error);
        }
    }, [BackendURL, handleGlobalApiError]);

    const updateNote = useCallback(async (id, updatedData) => {
        try {
            const updatedNote = await notesService.updateNote(BackendURL, id, updatedData);
            setNotes(prevNotes => prevNotes.map(note =>
                note.id === id ? updatedNote : note
            ));
        } catch (error) {
            handleGlobalApiError(error);
        }
    }, [BackendURL, handleGlobalApiError]);

    const deleteNotes = useCallback(async (idsToDelete) => {
        try {
            await notesService.deleteNotes(BackendURL, idsToDelete);
            await fetchNotes();
        } catch (error) {
            handleGlobalApiError(error);
        }
    }, [BackendURL, fetchNotes, handleGlobalApiError]);


    const value = {
        notes,
        fetchNotes,
        createNote,
        updateNote,
        deleteNotes,
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};