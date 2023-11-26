function AddedSound({sound, sound_name_correct, changeSound, deleteSound}) {
  return (
    <div className='card text-sm'>
        <div className='card-body p-2'>
            <div className='row'>
                <div className='col-3'>
                    <input type='text' className={"form-control form-control-sm "+(sound_name_correct?"is-valid":"is-invalid")}
                        value={sound.name} onChange={(e)=>changeSound(e, "name")} placeholder="Sound name"/>
                </div>
                <div className='col-4 px-1 d-flex justify-content-end align-items-center'>
                    <p className='card-text text-sm'>Average time between triggers</p>
                </div>
                <div className="col-2 ps-1">
                    <input type='number' className="form-control form-control-sm" value={sound.average_time} onChange={(e)=>changeSound(e, "average_time")} min={0} max={1200}/>
                </div>
                <div className='col-1 pe-1 d-flex justify-content-end align-items-center'>
                    <p className='card-text'>Volume</p>
                </div>
                <div className="col-1 px-1">
                    <input type='number' className="form-control form-control-sm" value={sound.volume} onChange={(e)=>changeSound(e, "volume")} min={0} max={2} step={0.05}/>
                </div>
                <div className='col-1 d-flex justify-content-end align-items-center'>
                    <button type="button" className="btn-close" onClick={deleteSound}></button>
                </div>
            </div>
            <div className='row'>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={sound.morning} onChange={(e)=>changeSound(e, "morning")}/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Morning
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={sound.day} onChange={(e)=>changeSound(e, "day")}/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Day
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={sound.evening} onChange={(e)=>changeSound(e, "evening")}/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Evening
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={sound.night} onChange={(e)=>changeSound(e, "night")}/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Night
                    </label>
                </div>
            </div>
        </div>
    </div>
  );
}

export default AddedSound;