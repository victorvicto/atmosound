import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import MainPage from './components/MainPage.jsx';
import SoundsLibPage from './components/SoundsLibPage.jsx';

function App() {
    const[error_message, set_error_message] = useState("");

    function initialisePlaces(){
        let start_places = JSON.parse(localStorage.getItem("places"));
        if (start_places === null) {
            start_places = {}
        }
        return start_places;
    }

    function initialisePlacesStatus(){
        const base_places_status = {};
        for(let place_name in places){
            base_places_status[place_name] = {
                "state": "off",
                "muffle_amount": 0.5,
                "distance": 50
            }
        }
        return base_places_status;
    }

    function initialiseSounds(){
        let start_sounds = JSON.parse(localStorage.getItem("sounds"));
        if (start_sounds === null) {
            start_sounds = {}
        }
        return start_sounds;
    }

    function initialiseBiomes(){
        let start_biomes = JSON.parse(localStorage.getItem("biomes"));
        if (start_biomes === null) {
            start_biomes = {
                "default":{},
                "icelands":{},
                "oriental":{}
            }
        }
        return start_biomes;
    }

    const [places, set_places] = useState(initialisePlaces);
    const [places_status, set_places_status] = useState(initialisePlacesStatus);
    const [sounds, set_sounds] = useState(initialiseSounds);
    const [biomes, set_biomes] = useState(initialiseBiomes);

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
                "muffle_amount": 0.5
            }
        });
        localStorage.setItem("places", JSON.stringify(new_places));
        return new_place_name;
    }

    function savePlace(place_name, new_place_name, new_content){
        if(new_place_name!=place_name){
            if(places[new_place_name]!==undefined){
                set_error_message("Tried to create a place with a name that already exists");
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
                    </ul>
                    <button type="button" className="btn btn-outline-success" onClick={()=>{set_error_message("coucou")}}>Upload setup</button>
                    <button type="button" className="btn btn-outline-success ms-2">Save my setup</button>
                </div>
            </div>
        </nav>
        <div className="tab-content">
            <div className="tab-pane fade show active p-2 p-md-5" id="main-page" role="tabpanel">
                <MainPage places={places}
                            sounds={sounds} 
                            addPlace={addPlace} 
                            savePlace={savePlace} 
                            deletePlace={deletePlace} 
                            places_status={places_status} 
                            set_places_status={set_places_status}/>
            </div>
            <div className="tab-pane fade p-2 p-md-5" id="sounds-lib-page" role="tabpanel">
                <SoundsLibPage sounds={sounds} addSound={addSound} changeSound={changeSound}/>
            </div>
        </div>
        {error_toast}
        </>
    )
}

export default App
