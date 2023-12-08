import { useState } from 'react';

function AddedSound({sound, sound_name_correct, changeSound, deleteSound}) {
    const [is_open, set_is_open] = useState(false);

    if(sound.time_of_day==undefined) sound.time_of_day = {morning: true, day:true, evening:true, night:true}; // to remove in finished version

    let time_of_day_checkboxes = Object.entries(sound.time_of_day).map(([time_of_day_name, time_of_day_on]) =>
        <div className="d-flex flex-row align-items-center gap-1" key={time_of_day_name+"timeofday-checkbox"}>
            <input type="checkbox" checked={time_of_day_on} onChange={(e)=>changeSound(e, ("time_of_day",time_of_day_name))}/>
            <small>
                {time_of_day_name}
            </small>
        </div>
    );

    if(sound.weathers==undefined) sound.weathers = {}; // to remove in finished version

    let weathers_checboxes = Object.entries(sound.weathers).map(([weather_name, weather_on]) => 
        <div className="d-flex flex-row align-items-center gap-1" key={weather_name+"weathers-checkbox"}>
            <input type="checkbox" checked={weather_on} onChange={(e)=>changeSound(e, ("weathers",weather_name))}/>
            <small>
                {weather_name}
            </small>
        </div>
    );
  return (
    <div className='card text-sm'>
        <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex flex-column gap-2 p-2">
                <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                    <a href='#' onClick={()=>set_is_open(!is_open)} className="icon-link text-decoration-none text-reset">
                        <i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i>
                    </a>
                    <input type='text' className={"form-control form-control-sm "+(sound_name_correct?"is-valid":"is-invalid")}
                        value={sound.name} onChange={(e)=>changeSound(e, "name")} placeholder="Sound name"/>
                    <button type="button" className="btn-close" onClick={deleteSound}></button>
                </div>
                {is_open &&
                <>
                    <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                        <small>Average time between triggers</small>
                        <input type='number' className="form-control form-control-sm w-50" value={sound.average_time} onChange={(e)=>changeSound(e, "average_time")} min={0} max={1200}/>
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                        <small>Volume</small>
                        <input type='number' className="form-control form-control-sm w-50" value={sound.volume} onChange={(e)=>changeSound(e, "volume")} min={0} max={2} step={0.05}/>
                    </div>
                </>}
            </li>
            {is_open &&
                <>
                <li className="list-group-item d-flex flex-row justify-content-between gap-3 flex-wrap">
                    {time_of_day_checkboxes}
                </li>
                <li className="list-group-item d-flex flex-row justify-content-between gap-3 flex-wrap">
                    {weathers_checboxes}
                </li>
                </>
                }
        </ul>
    </div>
  );
}

export default AddedSound;