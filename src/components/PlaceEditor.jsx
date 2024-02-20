import AddedSound from './AddedSound';
import AddedMuffled from './AddedMuffled';

import { RecursiveReplace, PromptEdit } from '../UtilityFunctions';
import EditableText from './EditableText';

function PlaceEditor({edited_place_name, places, sounds, weathers, savePlace, deletePlace, closeEditor, reloadAudio}){

    function addSound(sound_name){
        let new_place_info = {...places[edited_place_name]};
        let new_weathers = {};
        for(let weather_name of Object.keys(weathers)){
            new_weathers[weather_name] = true;
        }
        let new_sounds_list = {...new_place_info.sounds_list}
        new_sounds_list.push({
            name:sound_name,
            average_time:0,
            volume:1,
            time_of_day: {
                morning: true,
                day: true,
                evening: true,
                night: true
            },
            weathers: new_weathers
        });
        new_place_info.sounds_list = new_sounds_list;
        return savePlace(edited_place_name, edited_place_name, new_place_info);
    }

    function deleteSound(index){
        let new_place_info = {...places[edited_place_name]};
        new_place_info.sounds_list.splice(index, 1);
        savePlace(edited_place_name, edited_place_name, new_place_info);
    }

    function changeSound(event, index, property){ // setup lodash for weathers and time_of_day
        let new_place_info = {...places[edited_place_name]};
        if(event.target.type=="checkbox")
            RecursiveReplace(new_place_info.sounds_list[index], property, event.target.checked);
        else {
            RecursiveReplace(new_place_info.sounds_list[index], property, event.target.value.toLowerCase());
            if("max" in event.target){
                if(parseFloat(event.target.value)>parseFloat(event.target.max))
                    RecursiveReplace(new_place_info.sounds_list[index], property, event.target.max);
            }
            if("min" in event.target){
                if(parseFloat(event.target.value)<parseFloat(event.target.min))
                    RecursiveReplace(new_place_info.sounds_list[index], property, event.target.min);
            }
        }
        return savePlace(edited_place_name, edited_place_name, new_place_info);
    }

    function addMuffled(){
        let new_temp_place_info = {...temp_place_info};
        new_temp_place_info.muffled_list.push({
            name:"",
            muffle_amount:0.5,
            volume:1
        });
        set_temp_place_info(new_temp_place_info);
    }

    function deleteMuffled(index){
        let new_temp_place_info = {...temp_place_info};
        new_temp_place_info.muffled_list.splice(index, 1);
        set_temp_place_info(new_temp_place_info);
    }

    function changeMuffled(event, index, property){
        let new_temp_place_info = {...temp_place_info};
        new_temp_place_info.muffled_list[index][property] = event.target.value.toLowerCase();
        if("max" in event.target){
            if(parseFloat(event.target.value)>parseFloat(event.target.max)) new_temp_place_info.muffled_list[index][property] = event.target.max;
        }
        if("min" in event.target){
            if(parseFloat(event.target.value)<parseFloat(event.target.min)) new_temp_place_info.muffled_list[index][property] = event.target.min;
        }
        set_temp_place_info(new_temp_place_info);
    } 

    let sounds_list_html = (<p className='text-body-secondary m-0'><small>No sounds added</small></p>);
    if(temp_place_info.sounds_list.length>0){
        sounds_list_html = temp_place_info.sounds_list.map((sound, i) => 
            <AddedSound key={"added-sound-"+i}
                        weathers={weathers}
                        sound={sound}
                        sound_name_correct={sounds[sound.name]!==undefined}
                        changeSound={(event, property) => {changeSound(event, i, property)}}
                        deleteSound={()=> {deleteSound(i)}}/>
        );
    }

    let muffled_list_html = (<p className='text-body-secondary m-0'><small>No muffled places added</small></p>);
    if(temp_place_info.muffled_list.length>0){
        muffled_list_html = temp_place_info.muffled_list.map((muffled, i) => 
            <AddedMuffled key={"added-muffled-"+i}
                        muffled={muffled}
                        muffled_name_correct={places[muffled.name]!==undefined && muffled.name!=edited_place_name && muffled.name!=temp_place_name}
                        changeMuffled={(event, property) => {changeMuffled(event, i, property)}}
                        deleteMuffled={()=> {deleteMuffled(i)}}/>
        );
    }

    return (
        <div className="offcanvas offcanvas-start show"
            tabIndex="-1">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Place Editor</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeEditor}></button>
            </div>
            <div className="offcanvas-body">
                <div className="mb-3">
                    <label className="form-label">Name of the place</label>
                    <EditableText
                        base_text={edited_place_name}
                        edit_prompt={"New place name"}
                        applyChange={(new_place_name)=>{savePlace(edited_place_name, new_place_name.toLowerCase(), places[edited_place_name])}}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Sounds</label>
                    <div className='d-flex flex-column gap-2'>
                        {sounds_list_html}
                    </div>
                    <button type="button" className="btn btn-outline-primary btn-sm mt-2" 
                            onClick={()=>PromptEdit("New sound name", addSound)}>Add sound</button>
                </div>
                <div className="mb-3">
                    <label className="form-label">Muffled places</label>
                    <div className='d-flex flex-column gap-2'>
                        {muffled_list_html}
                    </div>
                    <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={addMuffled}>Add muffled place</button>
                </div>
                <div className='d-flex flex-column gap-2'>
                    <button type="button" className="btn btn-primary btn-lg" onClick={()=>{
                        if(savePlace(edited_place_name, temp_place_name, temp_place_info)){
                            reloadAudio();
                            closeEditor();
                        }}}>Save place</button>
                    <button type="button" className="btn btn-outline-danger" onClick={()=>{
                        if(confirm("Are you sure you want to delete the place called: "+edited_place_name)){
                            deletePlace(edited_place_name);
                            closeEditor();
                        }}}>Delete place <i className="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>
    )
}

export default PlaceEditor;