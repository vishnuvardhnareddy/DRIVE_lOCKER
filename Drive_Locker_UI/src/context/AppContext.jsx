// src/context/AppContext.js
import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../Util/constants";
import authService from "../services/AuthService";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const BackendURL = AppConstants.BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // New loading state

    axios.defaults.withCredentials = true;

    const getUserdata = async () => {
        try {
            const userProfile = await authService.getProfile(BackendURL);
            if (userProfile) {
                setUserData(userProfile);
                // console.log(userProfile);
            } else {
                setUserData(null);
            }
        } catch (error) {
            setUserData(null);
        }
    };

    const initializeAuth = async () => {
        try {
            const isLoggedInResult = await authService.isAuthenticated(BackendURL);
            setIsLoggedin(isLoggedInResult);

            if (isLoggedInResult) {
                await getUserdata();
            } else {
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setIsLoading(false); // Set loading to false after all checks, regardless of outcome
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const contextValue = {
        BackendURL,
        isLoggedin,
        userData,
        setIsLoggedin,
        getUserdata,
        setUserData,
        isLoading // Add isLoading to context value for other components to use
    };

    // --- Conditional rendering based on loading state ---

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};