import React, { createContext, useContext, useState } from 'react';
import default_setup from "./default_setup.json";

const DataTreeContext = createContext();

export const useDataTree = () => useContext(DataTreeContext);

const DataTreeProvider = ({ children }) => {
    const [dataTree, setDataTree] = useState(initialiseDataTree);

    function initialiseDataTree() {
        const storedDataTree = JSON.parse(localStorage.getItem("dataTree"));
        return storedDataTree || default_setup;
    }

    function validateDataTree(newDataTree) {
        // Add validation logic here
        // Return true if valid, false otherwise
        return true;
    }

    function updateDataTree(newDataTree) {
        if (validateDataTree(newDataTree)) {
            setDataTree(newDataTree);
            localStorage.setItem("dataTree", JSON.stringify(newDataTree));
        } else {
            console.error("Invalid data tree");
        }
    }



    function addPlace() {
        let newPlaceName = "new";
        let i = 0;
        while (newPlaceName in dataTree.places) {
            newPlaceName = "new" + i;
            i++;
        }
        const newDataTree = { ...dataTree };
        newDataTree.places[newPlaceName] = {
            sounds_list: [],
            muffled_list: [{ name: "weather", muffle_amount: "0", volume: "1" }],
            mood_overrides: {}
        };
        updateDataTree(newDataTree);
        return newPlaceName;
    }

    function savePlace(placeName, newPlaceName, newContent) {
        const newDataTree = { ...dataTree };
        if (newPlaceName !== placeName) {
            if (newDataTree.places[newPlaceName] !== undefined) {
                console.error("Place name already taken");
                return false;
            }
        }
        if (newPlaceName.length === 0) {
            console.error("Place name cannot be empty");
            return false;
        }
        newDataTree.places[newPlaceName] = newContent;
        if (newPlaceName !== placeName) {
            delete newDataTree.places[placeName];
        }
        updateDataTree(newDataTree);
        return true;
    }

    function deletePlace(placeName) {
        const newDataTree = { ...dataTree };
        delete newDataTree.places[placeName];
        updateDataTree(newDataTree);
    }

    function addSound() {
        let newSoundName = "new sound";
        let i = 0;
        while (newSoundName in dataTree.sounds) {
            newSoundName = "new sound " + i;
            i++;
        }
        const newDataTree = { ...dataTree };
        newDataTree.sounds[newSoundName] = {
            sound_packs: {
                default: {
                    sound_files: [{ url: "https://your-sound.url/here", volume_mul: 1, sliced: false }],
                    biome_presences: Object.keys(dataTree.biomes).reduce((acc, biome) => {
                        acc[biome] = true;
                        return acc;
                    }, {})
                }
            }
        };
        updateDataTree(newDataTree);
    }

    function changeSound(soundName, newSoundName, newContent) {
        const newDataTree = { ...dataTree };
        if (newSoundName !== soundName) {
            delete newDataTree.sounds[soundName];
        }
        newDataTree.sounds[newSoundName] = newContent;
        updateDataTree(newDataTree);
    }

    function deleteSound(soundName) {
        const newDataTree = { ...dataTree };
        delete newDataTree.sounds[soundName];
        updateDataTree(newDataTree);
    }

    function addBiome() {
        let newBiomeName = prompt("New biome name: ").toLowerCase();
        if (newBiomeName in dataTree.biomes) {
            console.error("Biome name already exists");
            return false;
        }
        if (newBiomeName.length === 0) {
            console.error("Biome name cannot be empty");
            return false;
        }
        const newDataTree = { ...dataTree };
        newDataTree.biomes[newBiomeName] = {};
        updateDataTree(newDataTree);
    }

    function changeBiomeName(oldBiomeName, newBiomeName) {
        const newDataTree = { ...dataTree };
        newDataTree.biomes[newBiomeName] = newDataTree.biomes[oldBiomeName];
        delete newDataTree.biomes[oldBiomeName];
        updateDataTree(newDataTree);
    }

    function deleteBiome(biomeName) {
        const newDataTree = { ...dataTree };
        delete newDataTree.biomes[biomeName];
        updateDataTree(newDataTree);
    }

    function addWeather() {
        let newWeatherName = prompt("New weather name: ").toLowerCase();
        if (newWeatherName in dataTree.weathers) {
            console.error("Weather name already exists");
            return "";
        }
        const newDataTree = { ...dataTree };
        newDataTree.weathers[newWeatherName] = { sounds_list: [], image_url: null };
        updateDataTree(newDataTree);
        return newWeatherName;
    }

    function changeWeather(weatherName, newWeatherName, newContent) {
        const newDataTree = { ...dataTree };
        if (newWeatherName !== weatherName) {
            delete newDataTree.weathers[weatherName];
        }
        newDataTree.weathers[newWeatherName] = newContent;
        updateDataTree(newDataTree);
    }

    function deleteWeather(weatherName) {
        const newDataTree = { ...dataTree };
        delete newDataTree.weathers[weatherName];
        updateDataTree(newDataTree);
    }

    function addMood() {
        let newMoodName = prompt("New mood name: ").toLowerCase();
        if (newMoodName in dataTree.moods) {
            console.error("Mood name already exists");
            return "";
        }
        const newDataTree = { ...dataTree };
        newDataTree.moods[newMoodName] = { sound: null };
        updateDataTree(newDataTree);
        return newMoodName;
    }

    function changeMoodName(moodName, newMoodName) {
        const newDataTree = { ...dataTree };
        newDataTree.moods[newMoodName] = newDataTree.moods[moodName];
        delete newDataTree.moods[moodName];
        updateDataTree(newDataTree);
    }

    function changeMoodSound(moodName, newMoodSound) {
        const newDataTree = { ...dataTree };
        newDataTree.moods[moodName].sound = newMoodSound;
        updateDataTree(newDataTree);
    }

    function deleteMood(moodName) {
        const newDataTree = { ...dataTree };
        delete newDataTree.moods[moodName];
        updateDataTree(newDataTree);
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
            dataTree,
            dispatchDataTree
        }}>
            {children}
        </DataTreeContext.Provider>
    );
};

export default DataTreeProvider;