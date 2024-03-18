import EditableText from "./EditableText";
import AddedSound from './AddedSound';

import { RecursiveReplace, PromptEdit } from '../UtilityFunctions';

function WeatherEditor({weathers, edited_weather_name, changeWeather,  deleteWeather, sounds, closeEditor}) {

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
    
    let sounds_list_html = (<p className='text-body-secondary m-0'><small>No sounds added</small></p>);
    if(weathers[edited_weather_name].sounds_list.length>0){
        sounds_list_html = weathers[edited_weather_name].sounds_list.map((sound, i) => 
            <AddedSound key={"added-sound-"+i}
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
            </div>
        </div>
    );
}

export default WeatherEditor;