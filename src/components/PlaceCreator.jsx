import { useState } from 'react';

import AddedSound from './AddedSound';
import { func } from 'prop-types';

function PlaceCreator({set_is_visible}){
    const [sounds_list, set_sounds_list] = useState([]);

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
        set_sounds_list(new_sounds_list);
    }   

    const sounds_list_html = sounds_list.map((sound, i) => 
            <AddedSound key={"added-sound-"+sound}
                        sound_name={sound.name}
                        name_change={(event) => {changeSound(i, "name", event)}}
                        average_time={sound.average_time}
                        average_time_change={(event) => {changeSound(i, "average_time", event)}}
                        volume={sound.volume}
                        volume_change={(event) => {changeSound(i, "volume", event)}}
                        delete_sound={()=> {deleteSound(i)}}/>
        );

    return (
        <div className="modal"
            id="place-creator-modal"
            tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title">Create new place</h1>
                        <button type="button" className="btn-close" onClick={()=>{set_is_visible(false)}}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="new-place-name" class="form-label">Name of the place</label>
                                <input type="text" class="form-control" id="new-place-name"/>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Sounds</label>
                                <div className='d-flex flex-column gap-2'>
                                    {sounds_list_html}
                                </div>
                                <button className="btn btn-outline-primary btn-sm" onClick={addSound}>Add sound</button>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                                <label class="form-check-label" for="exampleCheck1">Check me out</label>
                            </div>
                            <button type="submit" class="btn btn-primary">Create place</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceCreator