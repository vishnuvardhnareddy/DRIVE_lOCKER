// src/services/FileService.jsx
import axios from 'axios';
import { AppConstants } from "../Util/constants";

const API_URL = `${AppConstants.BACKEND_URL}/files`;

// Configure axios with credentials to handle cookies and authentication
axios.defaults.withCredentials = true;

const fileUpload = async (file, passkey) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('passkey', passkey);

        const response = await axios.post(`${API_URL}/upload-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // The success message
    } catch (error) {
        throw error.response?.data || 'An error occurred during file upload.';
    }
};

const getUserFiles = async () => {
    try {
        const response = await axios.get(`${API_URL}/`);
        console.log("files fetched " + response.data);

        return response.data; // List of files
    } catch (error) {
        console.log("error fetching");

        throw error.response?.data || 'Failed to retrieve user files.';
    }
};

const deleteFiles = async (publicIds) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-files`, {
            data: publicIds, // Axios sends request body for DELETE requests via the 'data' key
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // The success message
    } catch (error) {
        throw error.response?.data || 'Failed to delete files.';
    }
};

const FileService = {
    fileUpload,
    getUserFiles,
    deleteFiles,
};

export default FileService;