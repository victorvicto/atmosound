import EditLink from "./EditLink";

function WeatherEditor({weathers, edited_weather_name, changeWeather,  deleteWeather, closeEditor}) {

    return (
        <div className="offcanvas offcanvas-end show"
            tabIndex="-1">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title text-capitalize">{edited_weather_name}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeEditor}></button>
            </div>
            <div className="offcanvas-body">
                <h4 className="mb-3">
                    {edited_weather_name}
                    <EditLink edit_prompt={"New weather name"} applyChange={((new_weather_name)=>{
                        changeWeather(new_weather_name, weathers[edited_weather_name]);
                    })}/>
                </h4>
                <div className="mb-3">
                    <label className="form-label">Sounds</label>
                    <div className='d-flex flex-column gap-2'>
                        test
                    </div>
                    <button type="button" className="btn btn-outline-primary btn-sm mt-2">Add sound</button>
                </div>
            </div>
        </div>
    );
}

export default WeatherEditor;