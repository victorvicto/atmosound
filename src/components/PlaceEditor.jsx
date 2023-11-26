import { useState } from 'react';

import AddedSound from './AddedSound';
import AddedMuffled from './AddedMuffled';
import { func } from 'prop-types';

function PlaceEditor({edited_place_name, places, sounds, save_place}){
    const [sounds_list, set_sounds_list] = useState([]);
    const [muffled_list, set_muffled_list] = useState([]);
    const [place_name, set_place_name] = useState("");

    if(place_name=="" && edited_place_name!==""){
        set_place_name(edited_place_name);
    }

    function addSound(){
        set_sounds_list(sounds_list.concat([{
            name:"",
            average_time:0,
            volume:1,
            morning: true,
            day: true,
            evening: true,
            night: true
        }]));
    }

    function deleteSound(index){
        let new_sounds_list = [...sounds_list];
        new_sounds_list.splice(index, 1);
        set_sounds_list(new_sounds_list);
    }

    function changeSound(event, index, property){
        let new_sounds_list = [...sounds_list];
        console.log(event.target);
        if(event.target.type=="checkbox") new_sounds_list[index][property] = event.target.checked;
        else {
            new_sounds_list[index][property] = event.target.value.toLowerCase();
            if("max" in event.target){
                if(parseFloat(event.target.value)>parseFloat(event.target.max)) new_sounds_list[index][property] = event.target.max;
            }
            if("min" in event.target){
                if(parseFloat(event.target.value)<parseFloat(event.target.min)) new_sounds_list[index][property] = event.target.min;
            }
        }
        set_sounds_list(new_sounds_list);
    }

    function addMuffled(){
        set_muffled_list(muffled_list.concat([{
            name:"",
            muffle_amount:0.5
        }]));
    }

    function deleteMuffled(index){
        let new_muffled_list = [...muffled_list];
        new_muffled_list.splice(index, 1);
        set_muffled_list(new_muffled_list);
    }

    function changeMuffled(event, index, property){
        let new_muffled_list = [...muffled_list];
        new_muffled_list[index][property] = event.target.value.toLowerCase();
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
                        sound={sound}
                        sound_name_correct={sounds[sound.name]!==undefined}
                        changeSound={(event, property) => {changeSound(event, i, property)}}
                        deleteSound={()=> {deleteSound(i)}}/>
        );
    }

    let muffled_list_html = (<p className='text-body-secondary m-0'><small>No muffled places added</small></p>);
    if(muffled_list.length>0){
        muffled_list_html = muffled_list.map((muffled, i) => 
            <AddedMuffled key={"added-muffled-"+i}
                        muffled_name={muffled.name}
                        muffled_name_correct={places[muffled.name]!==undefined}
                        muffle_amount={muffled.muffle_amount}
                        changeMuffled={(event, property) => {changeMuffled(event, i, property)}}
                        deleteMuffled={()=> {deleteMuffled(i)}}/>
        );
    }

    function reset_form(){
        set_sounds_list([]);
        set_muffled_list([]);
        set_place_name("");
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
                                    onChange={(e)=>{set_place_name(e.target.value.toLowerCase())}}
                                    className={"form-control "+(places[place_name]!==undefined || place_name.length==0?"is-invalid":"is-valid")}/>
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
                            <button type="button" className="btn btn-primary" onClick={()=>{
                                save_place(place_name, sounds_list, muffled_list);
                                reset_form();}}>Create place</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceEditor;