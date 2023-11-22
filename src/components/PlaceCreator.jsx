import { useState } from 'react';

import AddedSound from './AddedSound';
import { func } from 'prop-types';

function PlaceCreator({sounds}){
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
            <AddedSound key={"added-sound-"+i}
                        sound_name={sound.name}
                        sound_name_correct={sounds[sound.name]!==undefined}
                        name_change={(event) => {changeSound(i, "name", event)}}
                        average_time={sound.average_time}
                        average_time_change={(event) => {changeSound(i, "average_time", event)}}
                        volume={sound.volume}
                        volume_change={(event) => {changeSound(i, "volume", event)}}
                        delete_sound={()=> {deleteSound(i)}}/>
        );

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
                                <input type="text" className="form-control" id="new-place-name"/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Sounds</label>
                                <div className='d-flex flex-column gap-2'>
                                    {sounds_list_html}
                                </div>
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addSound}>Add sound</button>
                            </div>
                            <button type="submit" className="btn btn-primary">Create place</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceCreator