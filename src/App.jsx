import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import MainPage from './components/MainPage.jsx';

function App() {
    const[error_message, set_error_message] = useState("");

    const [places, set_places] = useState({
        shop:{},
        village:{},
        prairy:{},
        cave:{},
        "castle hall":{},
        market:{}
    });
    const base_places_status = {};
    for(let place_name in places){
        base_places_status[place_name] = {
            "state": "off",
            "muffle_amount": 0.5,
            "distance": 50
        }
    }
    const [places_status, set_places_status] = useState(base_places_status);

    const [sounds, setSounds] = useState({
        "bell":{},
        "birds":{}
    });

    function addPlace(new_place_name, sounds_list, muffled_list){
        if(places[new_place_name]!==undefined){
            set_error_message("Tried to create a place with a name that already exists");
            return;
        }
        if(new_place_name.length==0){
            set_error_message("Tried to create a place with an empty name");
            return;
        }
        for(let sound of sounds_list){
            if(sounds[sound.name]==undefined){
                set_error_message("Tried to create a place containing a sound that doesn't exist");
                return;
            }
        }
        for(let muffled of muffled_list){
            if(places[muffled.name]==undefined){
                set_error_message("Tried to create a place containing a muffled place that doesn't exist");
                return;
            }
        }
        set_places({
            ...places,
            [new_place_name]:{
                "sounds_list": sounds_list,
                "muffled_list": muffled_list
            }
        });
        set_places_status({
            ...places_status,
            [new_place_name]:{
                "state": "off",
                "muffle_amount": 0.5,
                "distance": 50
            }
        });
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
            <div className="tab-pane fade show active p-5" id="main-page" role="tabpanel">
                <MainPage places={places} sounds={sounds} add_place={addPlace} places_status={places_status} set_places_status={set_places_status}/>
            </div>
            <div className="tab-pane fade p-5" id="sounds-lib-page" role="tabpanel">
                <h1>Sounds</h1>
            </div>
        </div>
        {error_toast}
        </>
    )
}

export default App
