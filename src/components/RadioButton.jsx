function RadioButton({val, onChange, checked}){
    return (
        <div className="form-check m-0 d-flex align-items-center gap-1">
            <input  className="form-check-input"
                    type="radio" 
                    name="time-of-day-radio" 
                    value={val}
                    id={val+'-radio'}
                    onChange={onChange}
                    checked={checked}/>
            <label className='form-check-label text-capitalise' htmlFor={val+'-radio'}>
                {val}
            </label>
        </div>
    )
}

export default RadioButton;