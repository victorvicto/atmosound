import { useState } from 'react'

function PlaceBadge({place_name, place_status, modify_status, switchStatus, open_place_editor}){

    let scheme = "secondary";
    let footer = ""
    if(place_status.state=="on"){
        scheme = "danger";
    } else if(place_status.state=="muffled"){
        scheme = "success";
        footer = (
        <div className='card-footer text-bg-success d-flex flex-column gap-2'>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-low"></i>
                <input type="range" value={place_status.volume}
                        onChange={(e)=>modify_status(e, "volume")}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high"></i>
            </div>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-high"></i>
                <input type="range" value={place_status.muffle_amount}
                        onChange={(e)=>modify_status(e, "muffle_amount")}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high opacity-25"></i>
            </div>
        </div>);
    }

    return (
        <div className={'card border-'+scheme+(place_status.state=="off"?' shadow-sm':' border-3 shadow')}>
            <div className='card-body d-flex flex-row gap-2 align-items-center'>
                <h5 className={"card-title mb-0 text-capitalize text-"+scheme}>
                    <a onClick={open_place_editor} href="#" className='text-reset'>{place_name}</a>
                </h5>
                <button onClick={()=>{switchStatus("on")}}
                    className={'btn btn'+(place_status.state=='on'?'':'-outline')+'-danger btn-sm border-2'}>
                    <i className="fa-solid fa-volume-high"></i>
                </button>
                <button onClick={()=>{switchStatus("muffled")}}
                    className={'btn btn'+(place_status.state=='muffled'?'':'-outline')+'-success btn-sm'}>
                    <i className="fa-solid fa-volume-low"></i>
                </button>
            </div>
            {footer}
        </div>
    )
}

export default PlaceBadge;