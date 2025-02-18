import { useState } from "react";
import { useDataTree } from "../DataTreeContext";
import { useStateContext } from "../StateContext";
import { act } from "react-dom/test-utils";

function WeatherBadge({ set_edited_weather_name }) {

    const { weathers, addWeather, updateAdjacentVolume, updateAdjacentMuffleAmount, addAdjacentPlace } = useDataTree();
    const { activePlace, adjacentPlaces, currentWeather, updateCurrentWeather } = useStateContext();

    const [is_open, set_is_open] = useState(false);
    
    let scheme = "secondary";
    let footer = ""
    if(activePlace=="weather"){
        scheme = "danger";
    } else if("weather" in Object.keys(adjacentPlaces)){
        scheme = "success";
        footer = (
        <div className='card-footer text-bg-success d-flex flex-column gap-2'>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-low"></i>
                <input type="range" value={adjacentPlaces["weather"].volume}
                        onChange={(e)=>updateAdjacentVolume("weather", e.target.value)}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high"></i>
            </div>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-high"></i>
                <input type="range" value={adjacentPlaces["weather"].muffle_amount}
                        onChange={(e)=>updateAdjacentMuffleAmount("weather", e.target.value)}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high opacity-25"></i>
            </div>
        </div>);
    }

    let weather_buttons = Object.keys(weathers).map((weather_name) =>
        <button key={weather_name+"-btn"}
                className={'btn btn-'+(currentWeather==weather_name?'':'outline-')+'primary btn-sm'}
                >
            <a href='#' className='text-decoration-none text-reset text-capitalize'
                onClick={()=>{
                    localStorage.setItem("current_weather", weather_name);
                    updateCurrentWeather(weather_name)}}>
                {weather_name}
            </a>
            {weather_name!="none" && <a href='#' className='icon-link text-decoration-none text-reset ms-2' onClick={()=>set_edited_weather_name(weather_name)}>
                <i className="fa-solid fa-square-pen"></i>
            </a>}
        </button>
    );

    let badge_style = {};
    if(weathers[currentWeather].image_url!=null){
        badge_style = {backgroundImage:"linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0))",
                backgroundPosition:"top right", backgroundPositionY:"-150pt", backgroundSizeY:"400pt"};
        badge_style.backgroundImage+=", url('"+weathers[currentWeather].image_url+"')";
    }

    return (
        <div className={'card border-'+scheme+(scheme=="secondary"?' shadow-sm':' border-3 shadow')} style={badge_style}>
            <div className='card-body d-flex flex-column'>
                <div className='d-flex flex-row justify-content-between gap-2 align-items-center'>
                    <h2 className={"card-title mb-0 text-capitalize fw-semibold text-"+scheme}>
                        <a href='#' onClick={()=>set_is_open(!is_open)} className="icon-link text-decoration-none text-reset me-2"><i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i></a>
                        Weather
                        <small className="fs-5 ms-3">(selected: {currentWeather})</small>
                    </h2>
                    <div className="d-flex gap-2">
                        <button onClick={()=>{
                            if(scheme == "success"){
                                shutPlace("weather");
                            }else{
                                addAdjacentPlace("weather");
                            }
                        }}
                            className={'btn btn'+("weather" in Object.keys(adjacentPlaces)?'-success':'-outline-success bg-light')+' btn-sm'}>
                            <i className="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                </div>
                {is_open &&
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className='d-flex flex-row gap-2 align-items-center'>
                                {weather_buttons}
                                <button className="btn btn-outline-primary btn-sm" onClick={()=>addWeather()}>+</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {is_open && footer}
        </div>
    );
}

export default WeatherBadge;