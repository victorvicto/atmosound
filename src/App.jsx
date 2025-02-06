import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import MainPage from './components/MainPage.jsx';
import SoundsLibPage from './components/SoundsLibPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import BiomesPage from './components/BiomesPage.jsx';

import default_setup from "./default_setup.json";
import audioManager from './audioManagement/AudioManager.js';

function App() {
    const[error_message, set_error_message] = useState("");

    if(localStorage.getItem("short_transition_time")===null){
        localStorage.setItem("short_transition_time", 500);
    }
    if(localStorage.getItem("slow_transition_time")===null){
        localStorage.setItem("slow_transition_time", 60000);
    }
    if(localStorage.getItem("active_biome")===null){
        localStorage.setItem("active_biome", "default");
    }
    if(localStorage.getItem("time_of_day")===null){
        localStorage.setItem("time_of_day", "day");
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
        base_places_status["weather"] = {
            "state": "off",
            "muffle_amount": 0,
            "volume": 1
        }
        return base_places_status;
    }

    const [places_status, set_places_status] = useState(initialisePlacesStatus);
    const [audio_context_started, set_audio_context_started] = useState(false);
    const [need_upload, set_need_upload] = useState(false);

    function downloadSetup(){
        let setup = {
            "places": places,
            "sounds": sounds,
            "biomes": biomes,
            "weathers": weathers,
            "moods": moods,
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
        set_moods(setup_content.moods);
        localStorage.setItem("freesound_api_key", setup_content.free_sound_api_key);
        localStorage.setItem("places", JSON.stringify(setup_content.places));
        localStorage.setItem("sounds", JSON.stringify(setup_content.sounds));
        localStorage.setItem("biomes", JSON.stringify(setup_content.biomes));
        localStorage.setItem("weathers", JSON.stringify(setup_content.weathers));
        localStorage.setItem("moods", JSON.stringify(setup_content.moods))
        set_places_status(initialisePlacesStatus());
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
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#biomes-page" type="button" role="tab" aria-selected="false">
                                Biomes
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#settings-page" type="button" role="tab" aria-selected="false">
                                Settings
                            </button>
                        </li>
                    </ul>
                    {/* remove reset button on final build, it is just for development purpose */}
                    <div className='d-flex gap-2'>
                        <button type="button" className="btn btn-outline-danger" onClick={resetSetup}>Reset setup</button>
                        <button type="button" className="btn btn-outline-success" onClick={()=>{set_need_upload(true)}}>Upload setup</button>
                        <button type="button" className="btn btn-outline-success" onClick={downloadSetup}>Save my setup</button>
                    </div>
                </div>
            </div>
        </nav>
        <div className={"modal fade"+(need_upload?" show":"")} style={{display:(need_upload?"block":"none")}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Upload Settings</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={()=>{set_need_upload(false)}}></button>
                    </div>
                    <div className="modal-body">
                        <input type='file' accept='.json' onChange={(e) => { 
                            let file = e.target.files[0]; 
                            let reader = new FileReader();
                            reader.readAsText(file,'UTF-8');
                            reader.onload = readerEvent => {
                                let content = JSON.parse(readerEvent.target.result);
                                bakeInSetup(content);
                            }
                        }}/>
                    </div>
                </div>
            </div>
            </div>
        <div className="tab-content flex-grow-1">
            <div className="tab-pane fade show active p-2 p-md-3 h-100" id="main-page" role="tabpanel">
                {audio_context_started && <MainPage set_places_status={set_places_status}/>}
                {!audio_context_started && 
                    <div className='d-flex justify-content-center p-5'>
                        <button type="button" className='btn btn-primary btn-lg m-5 shadow shadow-md'
                                onClick={()=>{
                                        audioManager.startAudioContext();
                                        set_audio_context_started(true);
                                    }}>
                                    Activate audio context
                        </button>
                    </div>}
            </div>
            <div className="tab-pane fade p-2 p-md-5" id="sounds-lib-page" role="tabpanel">
                <SoundsLibPage/>
            </div>
            <div className="tab-pane fade p-2 p-md-5" id="biomes-page" role="tabpanel">
                <BiomesPage/>
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
