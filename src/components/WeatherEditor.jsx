function WeatherEditor({weathers, edited_weather_name, saveWeather, deleteWeather, closeEditor}) {

    return (
        <div className="offcanvas offcanvas-end show"
            tabIndex="-1">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title text-capitalize">{edited_weather_name}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeEditor}></button>
            </div>
            <div className="offcanvas-body">

            </div>
        </div>
    );
}

export default WeatherEditor;