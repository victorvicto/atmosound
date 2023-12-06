import { useState } from "react";

function WeatherBadge({ weathers, status, modify_status, switchStatus}) {

    const [is_open, set_is_open] = useState(false);
    const [current_weather, set_current_weather] = useState("none");

    let scheme = "secondary";
    let footer = ""
    if(status.state=="on"){
        scheme = "danger";
    } else if(status.state=="muffled"){
        scheme = "success";
        footer = (
        <div className='card-footer text-bg-success d-flex flex-column gap-2'>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-low"></i>
                <input type="range" value={status.volume}
                        onChange={(e)=>modify_status(e, "volume")}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high"></i>
            </div>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-high"></i>
                <input type="range" value={status.muffle_amount}
                        onChange={(e)=>modify_status(e, "muffle_amount")}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high opacity-25"></i>
            </div>
        </div>);
    }

    let weather_buttons = Object.keys(weathers).map((weather_name) =>
        <button key={weather_name}
                className={'btn btn-'+(current_weather==weather_name?'':'outline-')+'primary btn-sm'}
                >
            <a href='#' className='text-decoration-none text-reset text-capitalize' onClick={()=>{set_current_weather(weather_name)}}>
                {weather_name}
            </a>
            <a href='#' className='icon-link text-decoration-none text-reset ms-2' onClick={()=>console.log("click")}>
                <i className="fa-solid fa-square-pen"></i>
            </a>
        </button>
    );
    weather_buttons.push(<button className="btn btn-outline-primary btn-sm">+</button>);

    const badge_style = {backgroundImage:"linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1), rgba(255,255,255,1))",
                            backgroundPositionY:"-150pt", backgroundSizeY:"400pt"};
    badge_style.backgroundImage+=", url('"+weathers[current_weather].image_url+"')";

    return (
        <div className={'card border-'+scheme+(status.state=="off"?' shadow-sm':' border-3 shadow')} style={badge_style}>
            <div className='card-body d-flex flex-column'>
                <div className='d-flex flex-row justify-content-between gap-2 align-items-center'>
                    <h2 className={"card-title mb-0 text-capitalize fw-semibold text-light"} style={{textShadow:"2pt 2pt 8pt #000000"}}>
                        <a href='#' onClick={()=>set_is_open(!is_open)} className="icon-link text-decoration-none text-reset me-2"><i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i></a>
                        Weather
                        <small className="fs-5 ms-3">(selected: {current_weather})</small>
                    </h2>
                    <div className="d-flex gap-2">
                        <button onClick={()=>{switchStatus("on")}}
                            className={'btn btn'+(status.state=='on'?'':'-outline')+'-danger btn-sm border-2'}>
                            <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <button onClick={()=>{switchStatus("muffled")}}
                            className={'btn btn'+(status.state=='muffled'?'':'-outline')+'-success btn-sm'}>
                            <i className="fa-solid fa-volume-low"></i>
                        </button>
                    </div>
                </div>
                {is_open &&
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className='d-flex flex-row gap-2 align-items-center'>
                                {weather_buttons}
                            </div>
                        </div>
                    </div>
                }
            </div>
            {footer}
        </div>
    );
}

export default WeatherBadge;