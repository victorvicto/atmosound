import React, { createContext, useState } from 'react';
import { useContext } from 'react';
import { useDataTree } from './DataTreeContext';

const StateContext = createContext();

export const useStateContext = () => useContext(StateContext);

export const StateContextProvider = ({ children }) => {

    const { places } = useDataTree();

    // No need to make sure to add the default values to localStorage since those are the default anyway
    const [activePlace, setActivePlace] = useState(localStorage.getItem("active_place") || "none");
    const [adjacentPlaces, setAdjacentPlaces] = useState(JSON.parse(localStorage.getItem("adjacent_places")) || {});
    const [currentMood, setCurrentMood] = useState(localStorage.getItem("current_mood") || "none");
    const [timeOfDay, setTimeOfDay] = useState(localStorage.getItem("time_of_day") || "day");
    const [currentBiome, setCurrentBiome] = useState(localStorage.getItem("current_biome") || "default");
    const [currentWeather, setCurrentWeather] = useState(localStorage.getItem("current_weather") || "default");
    const [errorMessage, setErrorMessage] = useState("");

    const updateActivePlace = (placeName) => {
        if(placeName == activePlace){
            setActivePlace("none");
            localStorage.setItem("active_place", "none");
            return;
        }
        setActivePlace(placeName);
        let newAdjacentPlaces = {};
        if (placeName !== "none" && placeName !== "weather") {
            for (let muffledPlace of places[placeName].muffled_list) {
                newAdjacentPlaces[muffledPlace.name] = { volume: muffledPlace.volume, muffle_amount: muffledPlace.muffle_amount };
            }
        }
        updateAdjacentPlaces(newAdjacentPlaces);
        localStorage.setItem("active_place", placeName);
    };

    const updateAdjacentPlaces = (places) => {
        setAdjacentPlaces(places);
        localStorage.setItem("adjacent_places", JSON.stringify(places));
    };

    const addAdjacentPlace = (placeName) => {
        if (activePlace == placeName) {
            updateActivePlace("none");
        }
        if (placeName in adjacentPlaces) {
            return;
        }
        let newAdjacentPlaces = { ...adjacentPlaces, [placeName]: { volume: 1, muffle_amount: 0 } };
        updateAdjacentPlaces(newAdjacentPlaces);
    };
     
    const shutPlace = (place) => {
        if (place === activePlace) {
            updateActivePlace("none");
        }else if (adjacentPlaces.includes(place)) {
            updateAdjacentPlaces(adjacentPlaces.filter(p => p !== place));
        }
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
            addAdjacentPlace,
            shutPlace,
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

export default StateContextProvider;