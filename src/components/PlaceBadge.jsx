import { useState } from 'react'

function PlaceBadge({place_name, place_status, switchStatus}){

    let scheme = "secondary";
    let footer = ""
    if(place_status=="on"){
        scheme = "danger";
    } else if(place_status=="muffled"){
        scheme = "success";
        footer = (<div className='card-footer text-bg-success d-flex flex-row gap-2'>
            <i className="fa-solid fa-volume-low opacity-25"></i>
            <input type="range" defaultValue="0.5"
                    id={"place-badge-"+place_name+"-muffle-amount"}
                    name="muffle-amount" min="0" max="1"
                    step='.05'/>
            <i className="fa-solid fa-volume-high"></i>
        </div>);
    } else if(place_status=="distant"){
        scheme = "primary";
        footer = (<div className='card-footer text-bg-primary d-flex flex-row gap-2'>
            Close
            <input type="range" defaultValue="50"
                    id={"place-badge-"+place_name+"-distance"}
                    name="muffle-amount" min="0" max="200"/>
            Distant
        </div>);
    }

    return (
        <div className={'card border-'+scheme+(place_status=="off" || place_status==undefined?' shadow-sm':' border-3 shadow')}>
            <div className='card-body d-flex flex-row gap-2 align-items-center'>
                <h5 className={"card-title mb-0 text-capitalize text-"+scheme}>{place_name}</h5>
                <button onClick={()=>{switchStatus("on")}}
                    className={'btn btn'+(place_status=='on'?'':'-outline')+'-danger btn-sm border-2'}>
                    <i className="fa-solid fa-volume-high"></i>
                </button>
                <button onClick={()=>{switchStatus("muffled")}}
                    className={'btn btn'+(place_status=='muffled'?'':'-outline')+'-success btn-sm'}>
                    <i className="fa-solid fa-volume-low"></i>
                </button>
                <button onClick={()=>{switchStatus("distant")}}
                    className={'btn btn'+(place_status=='distant'?'':'-outline')+'-primary btn-sm'}>
                    <i className="fa-solid fa-people-arrows"></i>
                </button>
            </div>
            {footer}
        </div>
    )
}

export default PlaceBadge