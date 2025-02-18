import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import MainPage from './components/MainPage.jsx';
import SoundsLibPage from './components/SoundsLibPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import BiomesPage from './components/BiomesPage.jsx';

import audioManager from './audioManagement/AudioManager.js';
import SaveAndImport from './components/SaveAndImport.jsx';
import { useStateContext } from './StateContext.jsx';

function App() {

    const { errorMessage, setErrorMessage } = useStateContext();

    if(localStorage.getItem("short_transition_time")===null){
        localStorage.setItem("short_transition_time", 500);
    }
    if(localStorage.getItem("slow_transition_time")===null){
        localStorage.setItem("slow_transition_time", 60000);
    }

    let error_toast = null;
    if(errorMessage.length>0){
        error_toast = (
            <div className="position-fixed bottom-0 w-100 p-4" style={{"zIndex": 1056}}>
                <div className="alert alert-danger d-flex justify-content-between mb-0">
                    {errorMessage}
                    <button type="button" className="btn-close" onClick={()=>setErrorMessage("")}></button>
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
                    <SaveAndImport/>
                </div>
            </div>
        </nav>
        <div className="tab-content flex-grow-1">
            <div className="tab-pane fade show active p-2 p-md-3 h-100" id="main-page" role="tabpanel">
                <MainPage/>
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
