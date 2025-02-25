import EditableText from "./EditableText";
import AddedSound from './AddedSound';

import { RecursiveReplace, PromptEdit } from '../UtilityFunctions';
import { useDataTree } from "../DataTreeContext";
import { useStateContext } from "../StateContext";

function WeatherEditor({edited_weather_name, closeEditor}) {

    const { sounds, weathers } = useDataTree();
    const { changeWeather, deleteWeather } = useStateContext();

    function deleteThisWeather(){
        deleteWeather(edited_weather_name);
        set_current_weather("none");
    }

    function addSound(sound_name){
        let new_weather_info = {...weathers[edited_weather_name]};
        let new_sounds_list = [...new_weather_info.sounds_list]
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
            weathers: null
        });
        new_weather_info.sounds_list = new_sounds_list;
        return changeWeather(edited_weather_name, edited_weather_name, new_weather_info);
    }

    function changeSound(event, index, property){
        let new_weather_info = {...weathers[edited_weather_name]};
        if(event.target.type=="checkbox")
            RecursiveReplace(new_weather_info.sounds_list[index], property, event.target.checked);
        else {
            RecursiveReplace(new_weather_info.sounds_list[index], property, event.target.value.toLowerCase());
            if("max" in event.target){
                if(parseFloat(event.target.value)>parseFloat(event.target.max))
                    RecursiveReplace(new_weather_info.sounds_list[index], property, event.target.max);
            }
            if("min" in event.target){
                if(parseFloat(event.target.value)<parseFloat(event.target.min))
                    RecursiveReplace(new_weather_info.sounds_list[index], property, event.target.min);
            }
        }
        return changeWeather(edited_weather_name, edited_weather_name, new_weather_info);
    }

    function deleteSound(index){
        let new_weather_info = {...weathers[edited_weather_name]};
        new_weather_info.sounds_list.splice(index, 1);
        return changeWeather(edited_weather_name, edited_weather_name, new_weather_info);
    }

    function changeImageUrl(new_url){
        let new_weather_info = {...weathers[edited_weather_name]};
        new_weather_info.image_url = new_url;
        return changeWeather(edited_weather_name, edited_weather_name, new_weather_info);
    }

    let sounds_list_html = (<p className='text-body-secondary m-0'><small>No sounds added</small></p>);
    if(weathers[edited_weather_name].sounds_list.length>0){
        sounds_list_html = weathers[edited_weather_name].sounds_list.map((sound, i) => 
            <AddedSound key={"weather-added-sound-"+i}
                        weathers={weathers}
                        sound={sound}
                        sound_name_correct={sounds[sound.name]!==undefined}
                        changeSound={(event, property) => {changeSound(event, i, property)}}
                        deleteSound={()=> {deleteSound(i)}}/>
        );
    }
    
    return (
        <div className="offcanvas offcanvas-end show"
            tabIndex="-1">
            <div className="offcanvas-header">
                <h3 className="offcanvas-title text-capitalize">
                    <EditableText 
                        base_text={edited_weather_name}
                        edit_prompt={"New weather name"}
                        applyChange={(new_weather_name)=>{
                            changeWeather(new_weather_name, weathers[edited_weather_name]);
                        }}/>
                </h3>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeEditor}></button>
            </div>
            <div className="offcanvas-body">
                <div className="mb-3">
                    <label className="form-label">Sounds</label>
                    <div className='d-flex flex-column gap-2'>
                        {sounds_list_html}
                    </div>
                    <button type="button" className="btn btn-outline-primary btn-sm mt-2" 
                            onClick={()=>PromptEdit("New sound name", addSound)}>Add sound</button>
                </div>
                <div className="mb-3">
                    <label className="form-label">Image</label><br/>
                    <EditableText   base_text={weathers[edited_weather_name].image_url==null?"no image yet":weathers[edited_weather_name].image_url}
                                    edit_prompt={"new image url:"}
                                    applyChange={changeImageUrl}/>
                </div>
            </div>
        </div>
    );
}

export default WeatherEditor;