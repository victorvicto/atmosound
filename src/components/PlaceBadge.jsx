import { useState } from 'react'

function PlaceBadge({place_name}){
    const [status, set_status] = useState("off"); // "off", "on", "muffled", "distant"
    const [muffle_amount, set_muffle_amount] = useState(0.5);
    const [distance, set_distance] = useState(50);

    function switch_status(clicked_status){
        if(status==clicked_status) set_status("off");
        else set_status(clicked_status);
    }

    return (
        <div className="card">
            <div className='card-body d-flex flex-row gap-2 align-items-center'>
                <h5 className="card-title mb-0 text-capitalize">{place_name}</h5>
                <button onClick={()=>{switch_status("on")}}
                    className={'btn btn'+(status=='on'?'':'-outline')+'-danger btn-sm'}>
                    <i className="fa-solid fa-volume-high"></i>
                </button>
                <button onClick={()=>{switch_status("muffled")}}
                    className={'btn btn'+(status=='muffled'?'':'-outline')+'-success btn-sm'}>
                    <i className="fa-solid fa-volume-low"></i>
                </button>
                <button onClick={()=>{switch_status("distant")}}
                    className={'btn btn'+(status=='distant'?'':'-outline')+'-primary btn-sm'}>
                    <i className="fa-solid fa-people-arrows"></i>
                </button>
            </div>
        </div>
    )
}

export default PlaceBadge