function AddedSound({sound_name, sound_name_correct, name_change, average_time, average_time_change, volume, volume_change, delete_sound}) {
  return (
    <div className='card text-sm'>
        <div className='card-body'>
            <div className='row'>
                <div className='col'>
                    <input type='text' className={"form-control form-control-sm "+(sound_name_correct?"is-valid":"is-invalid")}
                        value={sound_name} onChange={name_change} placeholder="Sound name"/>
                </div>
                <div className='col'>
                    <p className='card-text'>Average time between triggers</p>
                    <input type='number' className="form-control form-control-sm" value={average_time} onChange={average_time_change} min={0} max={1200}/>
                </div>
                <div className='col border-start'>
                    <p className='card-text'>Volume</p>
                    <input type='range' value={volume} onChange={volume_change} min={0} max={2} step={0.05}/>
                </div>
            </div>
            <button type="button" className="btn-close" onClick={delete_sound}></button>
        </div>
    </div>
  );
}

export default AddedSound;