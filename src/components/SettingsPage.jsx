import { useState } from "react";

function SettingsPage() {
    const [freesound_api_key, set_freesound_api_key] = useState(localStorage.getItem("freesound_api_key") || "");
    const [short_transition_time, set_short_transition_time] = useState(localStorage.getItem("short_transition_time") || 500);
    const [slow_transition_time, set_slow_transition_time] = useState(localStorage.getItem("slow_transition_time") || 60000);
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
                <p className="m-0">short transition time (in ms): </p>
                <input type="number" className="form-control w-50"
                        value={short_transition_time}
                        onChange={(e)=>{
                            localStorage.setItem("short_transition_time", e.target.value);
                            set_short_transition_time(e.target.value)}}
                        min={0} max={120000}/>
            </div>
            <div className="d-flex align-items-center gap-2">
                <p className="m-0">slow transition time (in ms): </p>
                <input type="number" className="form-control w-50"
                        value={slow_transition_time}
                        onChange={(e)=>{
                            localStorage.setItem("slow_transition_time", e.target.value);
                            set_slow_transition_time(e.target.value)}}
                        min={0} max={120000}/>
            </div>
        </>
    );
}

export default SettingsPage;