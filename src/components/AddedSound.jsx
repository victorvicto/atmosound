import { useState } from 'react';

function AddedSound({sound, sound_name_correct, changeSound, deleteSound}) {
    const [is_open, set_is_open] = useState(false);
  return (
    <div className='card text-sm'>
        <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex flex-column gap-2 p-2">
                <div className="d-flex flex-row justify-content-between align-items-center gap-3">
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
                <li className="list-group-item d-flex flex-row justify-content-between gap-3 flex-wrap">
                    <div className="d-flex flex-row align-items-center gap-1">
                        <input type="checkbox" checked={sound.morning} onChange={(e)=>changeSound(e, "morning")}/>
                        <small>
                            Morning
                        </small>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-1">
                        <input type="checkbox" checked={sound.day} onChange={(e)=>changeSound(e, "day")}/>
                        <small>
                            Day
                        </small>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-1">
                        <input type="checkbox" checked={sound.evening} onChange={(e)=>changeSound(e, "evening")}/>
                        <small>
                            Evening
                        </small>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-1">
                        <input type="checkbox" checked={sound.night} onChange={(e)=>changeSound(e, "night")}/>
                        <small>
                            Night
                        </small>
                    </div>
                </li>}
        </ul>
    </div>
  );
}

export default AddedSound;