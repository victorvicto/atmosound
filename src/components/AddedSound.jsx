function AddedSound({sound_name, sound_name_correct, name_change, average_time, average_time_change, volume, volume_change, delete_sound}) {
  return (
    <div className='card text-sm'>
        <div className='card-body p-2'>
            <div className='row'>
                <div className='col-3'>
                    <input type='text' className={"form-control form-control-sm "+(sound_name_correct?"is-valid":"is-invalid")}
                        value={sound_name} onChange={name_change} placeholder="Sound name"/>
                </div>
                <div className='col-4 px-1 d-flex justify-content-end align-items-center'>
                    <p className='card-text text-sm'>Average time between triggers</p>
                </div>
                <div className="col-2 ps-1">
                    <input type='number' className="form-control form-control-sm" value={average_time} onChange={average_time_change} min={0} max={1200}/>
                </div>
                <div className='col-1 pe-1 d-flex justify-content-end align-items-center'>
                    <p className='card-text'>Volume</p>
                </div>
                <div className="col-1 px-1">
                    <input type='number' className="form-control form-control-sm" value={volume} onChange={volume_change} min={0} max={2} step={0.05}/>
                </div>
                <div className='col-1 d-flex justify-content-end align-items-center'>
                    <button type="button" className="btn-close" onClick={delete_sound}></button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default AddedSound;