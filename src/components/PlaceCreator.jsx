import { useState } from 'react';

import AddedSound from './AddedSound';
import AddedMuffled from './AddedMuffled';
import { func } from 'prop-types';

function PlaceCreator({places, sounds}){
    const [sounds_list, set_sounds_list] = useState([]);
    const [muffled_list, set_muffled_list] = useState([]);
    const [place_name, set_place_name] = useState("");

    function addSound(){
        set_sounds_list(sounds_list.concat([{
            name:"",
            average_time:0,
            volume:1
        }]));
    }

    function deleteSound(index){
        let new_sounds_list = [...sounds_list];
        new_sounds_list.splice(index, 1);
        set_sounds_list(new_sounds_list);
    }

    function changeSound(index, property, event){
        let new_sounds_list = [...sounds_list];
        new_sounds_list[index][property] = event.target.value;
        if("max" in event.target){
            if(parseFloat(event.target.value)>parseFloat(event.target.max)) new_sounds_list[index][property] = event.target.max;
        }
        if("min" in event.target){
            if(parseFloat(event.target.value)<parseFloat(event.target.min)) new_sounds_list[index][property] = event.target.min;
        }
        set_sounds_list(new_sounds_list);
    }

    function addMuffled(){
        set_muffled_list(muffled_list.concat([{
            name:"",
            muffled_amount:0.5
        }]));
    }

    function deleteMuffled(index){
        let new_muffled_list = [...muffled_list];
        new_muffled_list.splice(index, 1);
        set_muffled_list(new_muffled_list);
    }

    function changeMuffled(index, property, event){
        let new_muffled_list = [...muffled_list];
        new_muffled_list[index][property] = event.target.value;
        if("max" in event.target){
            if(parseFloat(event.target.value)>parseFloat(event.target.max)) new_muffled_list[index][property] = event.target.max;
        }
        if("min" in event.target){
            if(parseFloat(event.target.value)<parseFloat(event.target.min)) new_muffled_list[index][property] = event.target.min;
        }
        set_muffled_list(new_muffled_list);
    } 

    let sounds_list_html = (<p className='text-body-secondary m-0'><small>No sounds added</small></p>);
    if(sounds_list.length>0){
        sounds_list_html = sounds_list.map((sound, i) => 
            <AddedSound key={"added-sound-"+i}
                        sound_name={sound.name}
                        sound_name_correct={sounds[sound.name.toLowerCase()]!==undefined}
                        name_change={(event) => {changeSound(i, "name", event)}}
                        average_time={sound.average_time}
                        average_time_change={(event) => {changeSound(i, "average_time", event)}}
                        volume={sound.volume}
                        volume_change={(event) => {changeSound(i, "volume", event)}}
                        delete_sound={()=> {deleteSound(i)}}/>
        );
    }

    let muffled_list_html = (<p className='text-body-secondary m-0'><small>No muffled places added</small></p>);
    if(muffled_list.length>0){
        muffled_list_html = muffled_list.map((muffled, i) => 
            <AddedMuffled key={"added-muffled-"+i}
                        muffled_name={muffled.name}
                        muffled_name_correct={places[muffled.name.toLowerCase()]!==undefined}
                        name_change={(event) => {changeMuffled(i, "name", event)}}
                        muffled_amount={muffled.muffled_amount}
                        muffled_amount_change={(event) => {changeMuffled(i, "muffled_amount", event)}}
                        delete_muffled={()=> {deleteMuffled(i)}}/>
        );
    }

    return (
        <div className="modal fade"
            id="place-creator-modal"
            tabIndex="-1"
            aria-labelledby="place-creator-modal"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create new place</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Name of the place</label>
                                <input type="text"
                                    value={place_name}
                                    onChange={(e)=>{set_place_name(e.target.value)}}
                                    className={"form-control "+(places[place_name.toLowerCase()]!==undefined || place_name.length==0?"is-invalid":"is-valid")}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Sounds</label>
                                <div className='d-flex flex-column gap-2'>
                                    {sounds_list_html}
                                </div>
                                <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={addSound}>Add sound</button>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Muffled places</label>
                                <div className='d-flex flex-column gap-2'>
                                    {muffled_list_html}
                                </div>
                                <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={addMuffled}>Add muffled place</button>
                            </div>
                            <button type="button" className="btn btn-primary">Create place</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceCreator