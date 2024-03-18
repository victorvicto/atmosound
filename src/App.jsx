import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as AudioManager from "./AudioManager";

import MainPage from './components/MainPage.jsx';
import SoundsLibPage from './components/SoundsLibPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';

import default_setup from "./default_setup.json";

function App() {
    const[error_message, set_error_message] = useState("");

    if(localStorage.getItem("transition_time")===null){
        localStorage.setItem("transition_time", 500);
    }
    if(localStorage.getItem("active_biome")===null){
        localStorage.setItem("active_biome", "default");
    }
    if(localStorage.getItem("time_of_day")===null){
        localStorage.setItem("time_of_day", "day");
    }

    function initialisePlaces(){
        let start_places = JSON.parse(localStorage.getItem("places"));
        if (start_places === null) {
            start_places = default_setup.places;
            localStorage.setItem("places", JSON.stringify(start_places));
        }
        return start_places;
    }

    function initialisePlacesStatus(){
        const base_places_status = {};
        for(let place_name in JSON.parse(localStorage.getItem("places"))){
            base_places_status[place_name] = {
                "state": "off",
                "muffle_amount": 0.5,
                "volume": 1
            }
        }
        return base_places_status;
    }

    function initialiseSounds(){
        let start_sounds = JSON.parse(localStorage.getItem("sounds"));
        if (start_sounds === null) {
            start_sounds = default_setup.sounds;
            localStorage.setItem("sounds", JSON.stringify(start_sounds));
        }
        return start_sounds;
    }

    function initialiseBiomes(){
        let start_biomes = JSON.parse(localStorage.getItem("biomes"));
        if (start_biomes === null) {
            start_biomes = default_setup.biomes;
            localStorage.setItem("biomes", JSON.stringify(start_biomes));
        }
        return start_biomes;
    }

    function initialiseWeathers(){
        let start_weathers = JSON.parse(localStorage.getItem("weathers"));
        if (start_weathers === null) {
            start_weathers = default_setup.weathers;
            localStorage.setItem("weathers", JSON.stringify(start_weathers));
        }
        return start_weathers;
    }

    const [places, set_places] = useState(initialisePlaces);
    const [places_status, set_places_status] = useState(initialisePlacesStatus);
    const [sounds, set_sounds] = useState(initialiseSounds);
    const [biomes, set_biomes] = useState(initialiseBiomes);
    const [weathers, set_weathers] = useState(initialiseWeathers);
    const [audio_context_started, set_audio_context_started] = useState(false);

    function addPlace(){
        let new_place_name = "new";
        let i = 0;
        while(new_place_name in places){
            new_place_name = "new" + i;
            i++;
        }
        let new_places = {
            ...places,
            [new_place_name]:{
                "sounds_list": [],
                "muffled_list": []
            }
        };
        set_places(new_places);
        set_places_status({
            ...places_status,
            [new_place_name]:{
                "state": "off",
                "muffle_amount": 0.5,
                "volume": 1
            }
        });
        localStorage.setItem("places", JSON.stringify(new_places));
        return new_place_name;
    }

    function savePlace(place_name, new_place_name, new_content){
        if(new_place_name!=place_name){
            if(places[new_place_name]!==undefined){
                set_error_message("Tried to use a place's name that is already taken");
                return false;
            }
        }
        if(new_place_name.length==0){
            set_error_message("Tried to create a place with an empty name");
            return false;
        }
        for(let sound of new_content.sounds_list){
            if(sounds[sound.name]==undefined){
                set_error_message("Tried to create a place containing a sound that doesn't exist");
                return false;
            }
        }
        for(let muffled of new_content.muffled_list){
            if(places[muffled.name]==undefined){
                set_error_message("Tried to create a place containing a muffled place that doesn't exist");
                return false;
            }
            if(muffled.name==place_name || muffled.name==new_place_name){
                set_error_message("Tried to create a place containing itself as a muffled place");
                return false;
            }
        }

        let new_places = {...places};
        new_places[new_place_name] = new_content;
        if(new_place_name!=place_name){
            delete new_places[place_name];

            // modifying all places that were using this place
            for(let other_place_name in new_places){
                for(let muffled of new_places[other_place_name].muffled_list){
                    if(muffled.name==place_name) muffled.name = new_place_name;
                }
            }

            let new_places_status = {...places_status};
            new_places_status[new_place_name] = {...new_places_status[place_name]};
            delete new_places_status[place_name];
            set_places_status(new_places_status);
        }
        set_places(new_places);
        localStorage.setItem("places", JSON.stringify(new_places));
        return true;
    }

    function deletePlace(place_name){
        let new_places = {...places};
        let new_places_status = {...places_status};
        delete new_places[place_name];
        delete new_places_status[place_name];

        // modifying all places that were using this place
        for(let other_place_name in new_places){
            let new_muffled_list = []
            for(let muffled of new_places[other_place_name].muffled_list){
                if(muffled.name!=place_name) new_muffled_list.push(muffled);
            }
            new_places[other_place_name].muffled_list = new_muffled_list;
        }

        set_places(new_places);
        set_places_status(new_places_status);
        localStorage.setItem("places", JSON.stringify(new_places));
    }

    function addSound(){
        let new_sound_name = "new sound";
        let i = 0;
        while(new_sound_name in sounds){
            new_sound_name = "new sound " + i;
            i++;
        }
        let biomes_presence = {};
        for(let biome in biomes){
            biomes_presence[biome] = true;
        }
        let new_sounds = {
            ...sounds,
            [new_sound_name]:{
                "sound_packs":[
                    {
                        "sound_files": [
                            {
                                "url": "https://your-sound.url/here",
                                "volume_mul": 1
                            }
                        ],
                        "biome_presences": biomes_presence
                    }
                ]
            }
        };
        set_sounds(new_sounds);
        localStorage.setItem("sounds", JSON.stringify(new_sounds));
    }

    function changeSound(sound_name, new_sound_name, new_content){
        if(new_sound_name!=sound_name){
            if(sounds[new_sound_name]!==undefined){
                set_error_message("Tried to rename sound to already existing name");
                return false;
            }
        }
        if(new_sound_name.length==0){
            set_error_message("Tried to set sound name to empty");
            return false;
        }

        let new_sounds = {...sounds};
        new_sounds[new_sound_name] = new_content;

        for(let sound_pack of new_sounds[new_sound_name].sound_packs){
            if(Object.keys(sound_pack.biome_presences).length==0){
                for(let biome in biomes){
                    sound_pack.biome_presences[biome] = false;
                }
            }
        }

        if(new_sound_name!=sound_name){
            delete new_sounds[sound_name];

            // modifying all places that use this sound
            let new_places = {...places};
            for(let place_name in new_places){
                for(let sound of new_places[place_name].sounds_list){
                    if(sound.name==sound_name) sound.name = new_sound_name;
                }
            }
            set_places(new_places);
        }
        set_sounds(new_sounds);
        localStorage.setItem("sounds", JSON.stringify(new_sounds));
        return true;
    }

    function deleteSound(sound_name){
        let new_sounds = {...sounds};
        delete new_sounds[sound_name];
        set_sounds(new_sounds);
        localStorage.setItem("sounds", JSON.stringify(new_sounds));

        // modifying all places that were using this place
        let new_places = {...places};
        for(let place_name in new_places){
            let new_sounds_list = []
            for(let sound of new_places[place_name].sounds_list){
                if(sound.name!=sound_name) new_sounds_list.push(sound);
            }
            new_places[place_name].sounds_list = new_sounds_list;
        }
        set_places(new_places);
        localStorage.setItem("places", JSON.stringify(new_places));
    }

    function addWeather(){
        let new_weather_name = "new weather";
        let i = 0;
        while(new_weather_name in weathers){
            new_weather_name = "new weather " + i;
            i++;
        }
        let new_weathers = {
            ...weathers,
            [new_weather_name]:{
                "sounds_list": [],
                "image_url": ""
            }
        };
        let new_places = {...places};
        for(let place_name in new_places){
            for(let sound of new_places[place_name].sounds_list){
                sound.weathers[new_weather_name] = true;
            }
        }
        set_places(new_places);
        localStorage.setItem("places", JSON.stringify(new_places));
        set_weathers(new_weathers);
        localStorage.setItem("weathers", JSON.stringify(new_weathers));
        return new_weather_name;
    }

    function changeWeather(weather_name, new_weather_name, new_content){
        console.log(new_content);
        if(new_weather_name!=weather_name){
            if(weathers[new_weather_name]!==undefined){
                set_error_message("Tried to create a weather with a name that already exists");
                return false;
            }
        }
        if(new_weather_name.length==0){
            set_error_message("Tried to create a weather with an empty name");
            return false;
        }
        for(let sound of new_content.sounds_list){
            if(sounds[sound.name]==undefined){
                set_error_message("Tried to create a weather containing a sound that doesn't exist");
                return false;
            }
        }

        let new_weathers = {...weathers};
        new_weathers[new_weather_name] = new_content;
        if(new_weather_name!=weather_name){
            delete new_weathers[weather_name];

            let new_places = {...places};
            for(let place_name in new_places){
                for(let sound of new_places[place_name].sounds_list){
                    sound.weathers[new_weather_name] = sound.weathers[weather_name];
                    delete sound.weathers[weather_name];
                }
            }
            set_places(new_places);
            localStorage.setItem("places", JSON.stringify(new_places));
        }

        set_weathers(new_weathers);
        localStorage.setItem("weathers", JSON.stringify(new_weathers));
        return true;
    }

    function deleteWeather(weather_name){
        let new_weathers = {...weathers};
        delete new_weathers[weather_name];
        let new_places = {...places};
        for(let place_name in new_places){
            for(let sound of new_places[place_name].sounds_list){
                delete sound.weathers[weather_name];
            }
        }
        set_places(new_places);
        localStorage.setItem("places", JSON.stringify(new_places));
        set_weathers(new_weathers);
        localStorage.setItem("weathers", JSON.stringify(new_weathers));
    }

    function downloadSetup(){
        let setup = {
            "places": places,
            "sounds": sounds,
            "biomes": biomes,
            "weathers": weathers,
            "free_sound_api_key": localStorage.getItem("freesound_api_key") || ""
        };
        let data_string = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(setup));
        var downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", data_string);
        downloadLink.setAttribute("download", "my_atmousound_setup.json");
        downloadLink.click();
        downloadLink.remove();
    }

    function bakeInSetup(setup_content){
        set_places(setup_content.places);
        set_sounds(setup_content.sounds);
        set_biomes(setup_content.biomes);
        set_weathers(setup_content.weathers);
        localStorage.setItem("freesound_api_key", setup_content.free_sound_api_key);
        localStorage.setItem("places", JSON.stringify(setup_content.places));
        localStorage.setItem("sounds", JSON.stringify(setup_content.sounds));
        localStorage.setItem("biomes", JSON.stringify(setup_content.biomes));
        localStorage.setItem("weathers", JSON.stringify(setup_content.weathers));
        set_places_status(initialisePlacesStatus());
    }

    function uploadSetup(){
        if(!confirm("This will overwrite your current setup. Are you sure?")) return;
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => { 
            let file = e.target.files[0]; 
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');
            reader.onload = readerEvent => {
                let content = JSON.parse(readerEvent.target.result);
                bakeInSetup(content);
            }
        }
        input.click();
        input.remove();
    }

    function resetSetup(){
        if(!confirm("This will reset your setup to the default one. Are you sure?")) return;
        localStorage.clear();
        bakeInSetup(default_setup);
    }

    let error_toast = null;
    if(error_message.length>0){
        error_toast = (
            <div className="position-fixed bottom-0 w-100 p-4" style={{"zIndex": 1056}}>
                <div className="alert alert-danger d-flex justify-content-between mb-0">
                    {error_message}
                    <button type="button" className="btn-close" onClick={()=>set_error_message("")}></button>
                </div>
            </div>
        );
    }

    return (
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Atmosound</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="nav me-auto" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#main-page" type="button" role="tab" aria-selected="true">
                                Main
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#sounds-lib-page" type="button" role="tab" aria-selected="false">
                                Sound Library
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#settings-page" type="button" role="tab" aria-selected="false">
                                Settings
                            </button>
                        </li>
                    </ul>
                    {/* remove reset button on final build, it is just for development purpose */}
                    <button type="button" className="btn btn-outline-danger" onClick={resetSetup}>Reset setup</button>
                    <button type="button" className="btn btn-outline-success ms-2" onClick={uploadSetup}>Upload setup</button>
                    <button type="button" className="btn btn-outline-success ms-2" onClick={downloadSetup}>Save my setup</button>
                </div>
            </div>
        </nav>
        <div className="tab-content">
            <div className="tab-pane fade show active p-2 p-md-3" id="main-page" role="tabpanel">
                {audio_context_started && <MainPage places={places}
                            sounds={sounds} 
                            biomes={biomes}
                            weathers={weathers}
                            addPlace={addPlace} 
                            savePlace={savePlace} 
                            deletePlace={deletePlace} 
                            places_status={places_status} 
                            set_places_status={set_places_status}
                            addWeather={addWeather}
                            changeWeather={changeWeather}
                            deleteWeather={deleteWeather}/>}
                {!audio_context_started && 
                    <div className='d-flex justify-content-center p-5'>
                        <button type="button" className='btn btn-primary btn-lg m-5 shadow shadow-md'
                                onClick={()=>{
                                    set_audio_context_started(true);
                                    AudioManager.startAudioContext();
                                    }}>
                                    Activate audio context
                        </button>
                    </div>}
            </div>
            <div className="tab-pane fade p-2 p-md-5" id="sounds-lib-page" role="tabpanel">
                <SoundsLibPage sounds={sounds} addSound={addSound} changeSound={changeSound} deleteSound={deleteSound}/>
            </div>
            <div className="tab-pane fade p-2 p-md-5" id="settings-page" role="tabpanel">
                <SettingsPage/>
            </div>
        </div>
        {error_toast}
        </>
    )
}

export default App
