import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import MainPage from './components/MainPage.jsx';

function App() {

    const [places, setPlaces] = useState({
        indoor:{
            shop:{}
        },
        outdoor:{
            village:{},
            prairy:{}
        }
    });
    const [sounds, setSounds] = useState({});

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
                    <button className="btn btn-outline-success">Upload setup</button>
                    <button className="btn btn-outline-success ms-2">Save my setup</button>
                </div>
            </div>
        </nav>
        <div className="tab-content">
            <div className="tab-pane fade show active p-5" id="main-page" role="tabpanel">
                <MainPage places={places}/>
            </div>
            <div className="tab-pane fade p-5" id="sounds-lib-page" role="tabpanel">
                <h1>Sounds</h1>
            </div>
        </div>
        </>
    )
}

export default App
