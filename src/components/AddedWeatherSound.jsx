import EditLink from "./EditLink";

function AddedWeatherSound(weather_sound, changeWeatherSound, deleteWeatherSound){
    const [is_open, set_is_open] = useState(false);

    return (
        <div className='card text-sm'>
            <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                <a href='#' onClick={()=>set_is_open(!is_open)} className="icon-link text-decoration-none text-reset">
                    <i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i>
                </a>
                <h5>
                    {weather_sound.name}
                    <EditLink   edit_prompt={"new name for "+weather_sound.name}
                                applyChange={(new_name)=>{changeWeatherSound("name", new_name)}}/>
                </h5>
                <button type="button" className="btn-close" onClick={deleteWeatherSound}></button>
            </div>
            {is_open &&
            <>
                <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                    <small>Average time between triggers</small>
                    <input type='number' className="form-control form-control-sm w-50" value={weather_sound.average_time} min={0} max={1200}/>
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                    <small>Volume</small>
                    <input type='number' className="form-control form-control-sm w-50" value={weather_sound.volume} min={0} max={2} step={0.05}/>
                </div>
            </>}
        </div>
    )
}

export default AddedWeatherSound;