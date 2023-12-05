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

    return (
        <div className={'card border-'+scheme+(status.state=="off"?' shadow-sm':' border-3 shadow')}>
            <div className='card-body d-flex flex-row justify-content-between gap-2 align-items-center'>
                <h2 className={"card-title mb-0 text-capitalize fw-semibold"}>
                    <a href='#' onClick={()=>set_is_open(!is_open)} className="icon-link text-decoration-none text-reset me-2"><i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i></a>
                    Weather
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
            {footer}
        </div>
    );
}

export default WeatherBadge;