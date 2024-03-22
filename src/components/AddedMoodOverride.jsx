import { useState } from 'react';

import EditableText from './EditableText';

function AddedMoodOverride({mood_name, mood_sound, changeMoodOverride, deleteMoodOverride}) {
    const [is_open, set_is_open] = useState(false);

    return (
        <div className='card text-sm'>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <div className="d-flex flex-row justify-content-between align-items-center gap-3">
                        <a href='#' onClick={()=>set_is_open(!is_open)} className="icon-link text-decoration-none text-reset">
                            <i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i>
                        </a>
                        <h5 className={"card-title mb-0 text-capitalize"}>{mood_name}</h5>
                        {/* <input type='text' className={"form-control form-control-sm "+(muffled_name_correct?"is-valid":"is-invalid")}
                            value={muffled.name} onChange={(e)=>changeMuffled(e, "name")} placeholder="Place name"/> */}
                        <button type="button" className="btn-close" onClick={deleteMoodOverride}></button>
                    </div>
                </li>
                {is_open && <>
                    <li className="list-group-item d-flex flex-column gap-2 p-2">
                        <div className='d-flex flex-row justify-content-between align-items-center gap-2'>
                            <small>Sound: </small>
                            <EditableText   base_text={mood_sound==null?"no sound yet":mood_sound}
                                            edit_prompt={"New sound name"}
                                            applyChange={(new_sound_name)=>{
                                                changeMoodOverride(mood_name, new_sound_name);
                                            }}/>
                        </div>
                    </li>
                </>}
            </ul>
        </div>
    );
  }
  
  export default AddedMoodOverride;