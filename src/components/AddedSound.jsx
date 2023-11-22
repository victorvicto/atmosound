function AddedSound({sound_name, name_change, average_time, average_time_change, volume, volume_change, delete_sound}) {
  return (
    <div className='card'>
        <div className='card-body'>
            <div className='row'>
                <div className='col'>
                    <input type='text' value={sound_name} onChange={name_change}/>
                </div>
                <div className='col'>
                    <p className='card-text'>Average time between triggers</p>
                    <input type='number' value={average_time} onChange={average_time_change} min={0} max={1200}/>
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