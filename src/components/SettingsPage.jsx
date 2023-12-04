import { useState } from "react";

function SettingsPage() {
    const [freesound_api_key, set_freesound_api_key] = useState(localStorage.getItem("freesound_api_key") || "");
    const [transition_time, set_transition_time] = useState(localStorage.getItem("transition_time") || 2000);
    return (
        <>
            <h3>My API keys</h3>
            <div className="d-flex align-items-center gap-2">
                <p className="m-0">Freesound.com (short id code : "<b>fs::</b>1234"):</p>
                <input type="text" className="form-control w-50"
                        placeholder="Freesound API key"
                        value={freesound_api_key}
                        onChange={(e)=>{
                            localStorage.setItem("freesound_api_key", e.target.value);
                            set_freesound_api_key(e.target.value)}}/>
            </div>
            <h3>Main page options</h3>
            <div className="d-flex align-items-center gap-2">
                <p className="m-0">transition speed (in ms): </p>
                <input type="number" className="form-control w-50"
                        value={transition_time}
                        onChange={(e)=>{
                            localStorage.setItem("transition_time", e.target.value);
                            set_transition_time(e.target.value)}}
                        min={0} max={120000}/>
            </div>
        </>
    );
}

export default SettingsPage;