import React, { createContext, useContext, useState, useEffect } from 'react';
import default_setup from "./default_setup.json";

const DataTreeContext = createContext();

export const useDataTree = () => useContext(DataTreeContext);

const DataTreeProvider = ({ children }) => {
    const [places, setPlaces] = useState(() => JSON.parse(localStorage.getItem('places')) || default_setup.places);
    const [sounds, setSounds] = useState(() => JSON.parse(localStorage.getItem('sounds')) || default_setup.sounds);
    const [biomes, setBiomes] = useState(() => JSON.parse(localStorage.getItem('biomes')) || default_setup.biomes);
    const [weathers, setWeathers] = useState(() => JSON.parse(localStorage.getItem('weathers')) || default_setup.weathers);
    const [moods, setMoods] = useState(() => JSON.parse(localStorage.getItem('moods')) || default_setup.moods);

    useEffect(() => {
        localStorage.setItem('places', JSON.stringify(places));
    }, [places]);

    useEffect(() => {
        localStorage.setItem('sounds', JSON.stringify(sounds));
    }, [sounds]);

    useEffect(() => {
        localStorage.setItem('biomes', JSON.stringify(biomes));
    }, [biomes]);

    useEffect(() => {
        localStorage.setItem('weathers', JSON.stringify(weathers));
    }, [weathers]);

    useEffect(() => {
        localStorage.setItem('moods', JSON.stringify(moods));
    }, [moods]);

    function updatePlaces(newPlaces) {
        // Add validation logic here
        // if no errors occured
        setPlaces(newPlaces);
        localStorage.setItem('places', JSON.stringify(newPlaces));
    }

    function updateSounds(newSounds) {
        // Add validation logic here
        // if no errors occured
        setSounds(newSounds);
        localStorage.setItem('sounds', JSON.stringify(newSounds));
    }

    function updateBiomes(newBiomes) {
        // Add validation logic here
        // if no errors occured
        setBiomes(newBiomes);
        localStorage.setItem('biomes', JSON.stringify(newBiomes));
    }

    function updateWeathers(newWeathers) {
        // Add validation logic here
        // if no errors occured
        setWeathers(newWeathers);
        localStorage.setItem('weathers', JSON.stringify(newWeathers));
    }

    function updateMoods(newMoods) {
        // Add validation logic here
        // if no errors occured
        setMoods(newMoods);
        localStorage.setItem('moods', JSON.stringify(newMoods));
    }

    function addPlace() {
        let newPlaceName = "new";
        let i = 0;
        while (newPlaceName in places) {
            newPlaceName = "new" + i;
            i++;
        }
        const newPlaces = { ...places, [newPlaceName]: { sounds_list: [], muffled_list: [{ name: "weather", muffle_amount: "0", volume: "1" }], mood_overrides: {} } };
        updatePlaces(newPlaces);
        return newPlaceName;
    }

    function savePlace(placeName, newPlaceName, newContent) {
        const newPlaces = { ...places };
        if (newPlaceName !== placeName) {
            if (newPlaces[newPlaceName] !== undefined) {
                console.error("Place name already taken");
                return false;
            }
        }
        if (newPlaceName.length === 0) {
            console.error("Place name cannot be empty");
            return false;
        }
        newPlaces[newPlaceName] = newContent;
        if (newPlaceName !== placeName) {
            delete newPlaces[placeName];
        }
        updatePlaces(newPlaces);
        return true;
    }

    function deletePlace(placeName) {
        const newPlaces = { ...places };
        delete newPlaces[placeName];
        updatePlaces(newPlaces);
    }

    function addSound() {
        let newSoundName = "new sound";
        let i = 0;
        while (newSoundName in sounds) {
            newSoundName = "new sound " + i;
            i++;
        }
        const newSounds = { ...sounds, [newSoundName]: { sound_packs: { default: { sound_files: [{ url: "https://your-sound.url/here", volume_mul: 1, sliced: false }], biome_presences: Object.keys(biomes).reduce((acc, biome) => { acc[biome] = true; return acc; }, {}) } } } };
        updateSounds(newSounds);
    }

    function changeSound(soundName, newSoundName, newContent) {
        const newSounds = { ...sounds };
        if (newSoundName !== soundName) {
            delete newSounds[soundName];
        }
        newSounds[newSoundName] = newContent;
        updateSounds(newSounds);
    }

    function deleteSound(soundName) {
        const newSounds = { ...sounds };
        delete newSounds[soundName];
        updateSounds(newSounds);
    }

    function addBiome() {
        let newBiomeName = prompt("New biome name: ").toLowerCase();
        if (newBiomeName in biomes) {
            console.error("Biome name already exists");
            return false;
        }
        if (newBiomeName.length === 0) {
            console.error("Biome name cannot be empty");
            return false;
        }
        const newBiomes = { ...biomes, [newBiomeName]: {} };
        updateBiomes(newBiomes);
    }

    function changeBiomeName(oldBiomeName, newBiomeName) {
        const newBiomes = { ...biomes };
        newBiomes[newBiomeName] = newBiomes[oldBiomeName];
        delete newBiomes[oldBiomeName];
        updateBiomes(newBiomes);
    }

    function deleteBiome(biomeName) {
        const newBiomes = { ...biomes };
        delete newBiomes[biomeName];
        updateBiomes(newBiomes);
    }

    function addWeather() {
        let newWeatherName = prompt("New weather name: ").toLowerCase();
        if (newWeatherName in weathers) {
            console.error("Weather name already exists");
            return "";
        }
        const newWeathers = { ...weathers, [newWeatherName]: { sounds_list: [], image_url: null } };
        updateWeathers(newWeathers);
        return newWeatherName;
    }

    function changeWeather(weatherName, newWeatherName, newContent) {
        const newWeathers = { ...weathers };
        if (newWeatherName !== weatherName) {
            delete newWeathers[weatherName];
        }
        newWeathers[newWeatherName] = newContent;
        updateWeathers(newWeathers);
    }

    function deleteWeather(weatherName) {
        const newWeathers = { ...weathers };
        delete newWeathers[weatherName];
        updateWeathers(newWeathers);
    }

    function addMood() {
        let newMoodName = prompt("New mood name: ").toLowerCase();
        if (newMoodName in moods) {
            console.error("Mood name already exists");
            return "";
        }
        const newMoods = { ...moods, [newMoodName]: { sound: null } };
        updateMoods(newMoods);
        return newMoodName;
    }

    function changeMoodName(moodName, newMoodName) {
        const newMoods = { ...moods };
        newMoods[newMoodName] = newMoods[moodName];
        delete newMoods[moodName];
        updateMoods(newMoods);
    }

    function changeMoodSound(moodName, newMoodSound) {
        const newMoods = { ...moods };
        newMoods[moodName].sound = newMoodSound;
        updateMoods(newMoods);
    }

    function deleteMood(moodName) {
        const newMoods = { ...moods };
        delete newMoods[moodName];
        updateMoods(newMoods);
    }

    const dispatchDataTree = (action) => {
        switch (action.type) {
            case 'ADD_PLACE':
                addPlace();
                break;
            case 'SAVE_PLACE':
                savePlace(action.payload.placeName, action.payload.newPlaceName, action.payload.newContent);
                break;
            case 'DELETE_PLACE':
                deletePlace(action.payload.placeName);
                break;
            case 'ADD_SOUND':
                addSound();
                break;
            case 'CHANGE_SOUND':
                changeSound(action.payload.soundName, action.payload.newSoundName, action.payload.newContent);
                break;
            case 'DELETE_SOUND':
                deleteSound(action.payload.soundName);
                break;
            case 'ADD_BIOME':
                addBiome();
                break;
            case 'CHANGE_BIOME_NAME':
                changeBiomeName(action.payload.oldBiomeName, action.payload.newBiomeName);
                break;
            case 'DELETE_BIOME':
                deleteBiome(action.payload.biomeName);
                break;
            case 'ADD_WEATHER':
                addWeather();
                break;
            case 'CHANGE_WEATHER':
                changeWeather(action.payload.weatherName, action.payload.newWeatherName, action.payload.newContent);
                break;
            case 'DELETE_WEATHER':
                deleteWeather(action.payload.weatherName);
                break;
            case 'ADD_MOOD':
                addMood();
                break;
            case 'CHANGE_MOOD_NAME':
                changeMoodName(action.payload.moodName, action.payload.newMoodName);
                break;
            case 'CHANGE_MOOD_SOUND':
                changeMoodSound(action.payload.moodName, action.payload.newMoodSound);
                break;
            case 'DELETE_MOOD':
                deleteMood(action.payload.moodName);
                break;
            default:
                console.error(`Unknown action type: ${action.type}`);
        }
    };

    return (
        <DataTreeContext.Provider value={{
            places,
            sounds,
            biomes,
            weathers,
            moods,
            dispatchDataTree
        }}>
            {children}
        </DataTreeContext.Provider>
    );
};

export default DataTreeProvider;