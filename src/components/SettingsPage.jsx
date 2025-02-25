import { useGlobalContext } from "../GlobalContext";

function SettingsPage() {
    
    const { freesoundApiKey, setFreesoundApiKey, shortTransitionTime, setShortTransitionTime, slowTransitionTime, setSlowTransitionTime } = useGlobalContext();

    return (
        <>
            <h3>My API keys</h3>
            <div className="d-flex align-items-center gap-2">
                <p className="m-0">Freesound.com (short id code : "<b>fs::</b>1234"):</p>
                <input type="text" className="form-control w-50"
                        placeholder="Freesound API key"
                        value={freesoundApiKey}
                        onChange={(e)=>{
                            localStorage.setItem("freesound_api_key", e.target.value);
                            setFreesoundApiKey(e.target.value)}}/>
            </div>
            <h3>Main page options</h3>
            <div className="d-flex align-items-center gap-2">
                <p className="m-0">short transition time (in ms): </p>
                <input type="number" className="form-control w-50"
                        value={shortTransitionTime}
                        onChange={(e)=>{
                            localStorage.setItem("short_transition_time", e.target.value);
                            setShortTransitionTime(e.target.value)}}
                        min={0} max={120000}/>
            </div>
            <div className="d-flex align-items-center gap-2">
                <p className="m-0">slow transition time (in ms): </p>
                <input type="number" className="form-control w-50"
                        value={slowTransitionTime}
                        onChange={(e)=>{
                            localStorage.setItem("slow_transition_time", e.target.value);
                            setSlowTransitionTime(e.target.value)}}
                        min={0} max={120000}/>
            </div>
        </>
    );
}

export default SettingsPage;