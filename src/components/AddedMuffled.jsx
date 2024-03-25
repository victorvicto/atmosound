import { useState } from 'react';

function AddedMuffled({muffled, muffled_name_correct, changeMuffled, deleteMuffled}) {
    const [is_open, set_is_open] = useState(false);

    return (
        <div className='card text-sm'>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <div className="d-flex flex-row justify-content-between align-items-center gap-3">
                        <a href='#' onClick={()=>set_is_open(!is_open)} className="icon-link text-decoration-none text-reset">
                            <i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i>
                        </a>
                        <h5 className={"card-title mb-0 text-capitalize"+(muffled_name_correct?"":" text-danger")}>{muffled.name}</h5>
                        {/* <input type='text' className={"form-control form-control-sm "+(muffled_name_correct?"is-valid":"is-invalid")}
                            value={muffled.name} onChange={(e)=>changeMuffled(e, "name")} placeholder="Place name"/> */}
                        <button type="button" className="btn-close" onClick={deleteMuffled}></button>
                    </div>
                </li>
                {is_open && <>
                    <li className="list-group-item d-flex flex-column gap-2 p-2">
                        <div className='d-flex flex-row justify-content-between align-items-center gap-2'>
                            <small>Muffle amount</small>
                            <input type='number' className="form-control form-control-sm w-50" value={muffled.muffle_amount} onChange={(e)=>changeMuffled(e, "muffle_amount")} min={0} max={1} step={0.05}/>
                        </div>
                        <div className='d-flex flex-row justify-content-between align-items-center gap-2'>
                            <small>Volume</small>
                            <input type='number' className="form-control form-control-sm w-50" value={muffled.volume} onChange={(e)=>changeMuffled(e, "volume")} min={0} max={1} step={0.05}/>
                        </div>
                    </li>
                </>}
            </ul>
        </div>
    );
  }
  
  export default AddedMuffled;