import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [freesoundApiKey, setFreesoundApiKey] = useState(localStorage.getItem("freesound_api_key") || "");
    const [shortTransitionTime, setShortTransitionTime] = useState(localStorage.getItem("short_transition_time") || 500);
    const [slowTransitionTime, setSlowTransitionTime] = useState(localStorage.getItem("slow_transition_time") || 60000);

    const updateFreesoundApiKey = (key) => {
        setFreesoundApiKey(key);
        localStorage.setItem("freesound_api_key", key);
    };

    const updateShortTransitionTime = (time) => {
        setShortTransitionTime(time);
        localStorage.setItem("short_transition_time", time);
    };

    const updateSlowTransitionTime = (time) => {
        setSlowTransitionTime(time);
        localStorage.setItem("slow_transition_time", time);
    };

    return (
        <GlobalContext.Provider value={{
            errorMessage,
            setErrorMessage,
            freesoundApiKey,
            updateFreesoundApiKey,
            shortTransitionTime,
            updateShortTransitionTime,
            slowTransitionTime,
            updateSlowTransitionTime
        }}>
            {children}
        </GlobalContext.Provider>
    );
};