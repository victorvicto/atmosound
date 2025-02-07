import React, { createContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {

    // No need to make sure to add the default values to localStorage since those are the default anyway
    const [activePlace, setActivePlace] = useState(localStorage.getItem("active_place") || "default");
    const [adjacentPlaces, setAdjacentPlaces] = useState(JSON.parse(localStorage.getItem("adjacent_places")) || []);
    const [currentMood, setCurrentMood] = useState(localStorage.getItem("current_mood") || "none");
    const [timeOfDay, setTimeOfDay] = useState(localStorage.getItem("time_of_day") || "day");
    const [currentBiome, setCurrentBiome] = useState(localStorage.getItem("current_biome") || "default");
    const [currentWeather, setCurrentWeather] = useState(localStorage.getItem("current_weather") || "default");
    const [errorMessage, setErrorMessage] = useState("");

    const updateActivePlace = (place) => {
        setActivePlace(place);
        localStorage.setItem("active_place", place);
    };

    const updateAdjacentPlaces = (places) => {
        setAdjacentPlaces(places);
        localStorage.setItem("adjacent_places", JSON.stringify(places));
    };

    const updateCurrentMood = (mood) => {
        setCurrentMood(mood);
        localStorage.setItem("current_mood", mood);
    };

    const updateTimeOfDay = (time) => {
        setTimeOfDay(time);
        localStorage.setItem("time_of_day", time);
    };

    const updateCurrentBiome = (biome) => {
        setCurrentBiome(biome);
        localStorage.setItem("current_biome", biome);
    };

    return (
        <StateContext.Provider value={{
            activePlace,
            updateActivePlace,
            adjacentPlaces,
            updateAdjacentPlaces,
            currentMood,
            updateCurrentMood,
            timeOfDay,
            updateTimeOfDay,
            currentBiome,
            updateCurrentBiome,
            currentWeather,
            setCurrentWeather,
            errorMessage,
            setErrorMessage
        }}>
            {children}
        </StateContext.Provider>
    );
};

export default StateContext;