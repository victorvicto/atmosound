function AddedSound({sound, sound_name_correct, changeSound, deleteSound}) {
  return (
    <div className='card text-sm'>
        <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex flex-column gap-2 p-2">
                <div className="d-flex flex-row justify-content-between align-items-center gap-3">
                    <input type='text' className={"form-control form-control-sm "+(sound_name_correct?"is-valid":"is-invalid")}
                        value={sound.name} onChange={(e)=>changeSound(e, "name")} placeholder="Sound name"/>
                    <button type="button" className="btn-close" onClick={deleteSound}></button>
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                    <small>Average time between triggers</small>
                    <input type='number' className="form-control form-control-sm w-50" value={sound.average_time} onChange={(e)=>changeSound(e, "average_time")} min={0} max={1200}/>
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                    <small>Volume</small>
                    <input type='number' className="form-control form-control-sm w-50" value={sound.volume} onChange={(e)=>changeSound(e, "volume")} min={0} max={2} step={0.05}/>
                </div>
            </li>
            <li className="list-group-item d-flex flex-row gap-3 flex-wrap">
                <div className="d-flex flex-row align-items-center gap-2">
                    <input className="form-check-input" type="checkbox" checked={sound.morning} onChange={(e)=>changeSound(e, "morning")}/>
                    <label className="form-check-label">
                        Morning
                    </label>
                </div>
                <div className="d-flex flex-row align-items-center gap-2">
                    <input className="form-check-input" type="checkbox" checked={sound.day} onChange={(e)=>changeSound(e, "day")}/>
                    <label className="form-check-label">
                        Day
                    </label>
                </div>
                <div className="d-flex flex-row align-items-center gap-2">
                    <input className="form-check-input" type="checkbox" checked={sound.evening} onChange={(e)=>changeSound(e, "evening")}/>
                    <label className="form-check-label">
                        Evening
                    </label>
                </div>
                <div className="d-flex flex-row align-items-center gap-2">
                    <input className="form-check-input" type="checkbox" checked={sound.night} onChange={(e)=>changeSound(e, "night")}/>
                    <label className="form-check-label">
                        Night
                    </label>
                </div>
            </li>
        </ul>
    </div>
  );
}

export default AddedSound;