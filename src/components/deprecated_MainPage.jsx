import { useState } from 'react'

import PlaceBadge from './PlaceBadge.jsx';
import PlaceEditor from './PlaceEditor.jsx';
import WeatherBadge from './WeatherBadge.jsx';
import WeatherEditor from './WeatherEditor.jsx';
import MoodEditor from './MoodEditor';
import RadioButton from './RadioButton';
import audioManager from '../audioManagement/AudioManager';

function MainPage(props) {

    function instantiateActiveBiome(){
        let new_active_biome = localStorage.getItem("active_biome");
        if(new_active_biome==null){
            localStorage.setItem("active_biome", "default");
            new_active_biome = "default";
        }
        return new_active_biome;
    }

    function instantiateTimeOfDay(){
        let new_time_of_day = localStorage.getItem("time_of_day");
        if(new_time_of_day==null){
            localStorage.setItem("time_of_day", "day");
            new_time_of_day = "day";
        }
        return new_time_of_day;
    }

    function instantiateCurrentWeather(){
        let new_current_weather = localStorage.getItem("current_weather");
        if(new_current_weather==null){
            localStorage.setItem("current_weather", "none");
            new_current_weather = "none";
        }
        return new_current_weather;
    }

    function instantiateCurrentMood(){
        let new_current_mood = localStorage.getItem("current_mood");
        if(new_current_mood==null){
            localStorage.setItem("current_mood", "none");
            new_current_mood = "none";
        }
        return new_current_mood;
    }

    function instantiateMoodVolume(){
        let new_mood_volume = localStorage.getItem("mood_volume");
        if(new_mood_volume==null){
            localStorage.setItem("mood_volume", 1);
            new_mood_volume = 1;
        }
        return new_mood_volume;
    }

    const [edited_place_name, set_edited_place_name] = useState("");
    const [edited_weather_name, set_edited_weather_name] = useState("");
    const [edited_mood_name, set_edited_mood_name] = useState("");
    const [right_editor_mode, set_right_editor_mode] = useState("");
    const [active_biome, set_active_biome] = useState(instantiateActiveBiome);
    const [time_of_day, set_time_of_day] = useState(instantiateTimeOfDay);
    const [current_weather, set_current_weather] = useState(instantiateCurrentWeather);
    const [current_mood, set_current_mood] = useState(instantiateCurrentMood);
    const [mood_opened, set_mood_opened] = useState(false);
    const [mood_volume, set_mood_volume] = useState(instantiateMoodVolume);
    const [has_been_started, set_has_been_started] = useState(false);

    // function getSoundUrls(sound_name){
    //     let urls = [];
    //     for(let sound_pack_name in props.sounds[sound_name].sound_packs){
    //         if(props.sounds[sound_name].sound_packs[sound_pack_name].biome_presences[localStorage.getItem("active_biome")]){
    //             for(let sound_file of props.sounds[sound_name].sound_packs[sound_pack_name].sound_files){
    //                 urls.push({url:sound_file.url, volume_mul:sound_file.volume_mul});
    //             }
    //         }
    //     }
    //     return urls;
    // }

    function updateMoodAudio(){
        audioManager.startMood(current_mood, localStorage.getItem("mood_volume"));
    }

    function reloadAudio(){
        audioManager.refresh(localStorage.getItem('short_transition_time'));
    }

    function transitionAudio(final_places_status, transitionTime){
        for(const [place_name, place_status] of Object.entries(final_places_status)){
            if(place_status.state=="off"){
                audioManager.stopPlace(place_name, transitionTime);
            } else if(place_status.state=="on"){
                audioManager.startPlace(place_name, 1, 0, transitionTime);
            } else if(place_status.state=="muffled"){
                audioManager.startPlace(place_name, place_status.volume, place_status.muffle_amount, transitionTime);
            }
        }
    }
    
    function turnOffAllPlaces(final_places_status){
        for(let place_name in final_places_status){
            final_places_status[place_name].state = "off";
        }
    }

    function switchState(place_name, new_state, transitionTime){
        let final_places_status = {...props.places_status};
        if(props.places_status[place_name].state==new_state){
            final_places_status[place_name].state = "off";
        } else {
            if(new_state=="on"){
                turnOffAllPlaces(final_places_status);
                if("muffled_list" in props.places[place_name]){
                    for(let muffled of props.places[place_name].muffled_list){
                        final_places_status[muffled.name].state = "muffled";
                        final_places_status[muffled.name].muffle_amount = muffled.muffle_amount;
                        final_places_status[muffled.name].volume = muffled.volume;
                    }
                }
            }
            final_places_status[place_name].state = new_state;
        }
        transitionAudio(final_places_status, transitionTime);
        props.set_places_status(final_places_status);
    }

    function modifyPlacesStatus(event, place_name, property){
        let new_places_status = {...props.places_status};
        new_places_status[place_name][property] = event.target.value;
        transitionAudio(new_places_status, localStorage.getItem('short_transition_time'));
        props.set_places_status(new_places_status);
    }

    // Making sure audio starts playing when loading page to previous setting activation
    if(!has_been_started){
        reloadAudio();
        set_has_been_started(true);
    }

    const places_badges = Object.entries(props.places).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name}
                        place_name={place_name}
                        place_status={props.places_status[place_name]}
                        modify_status={(e, property)=>modifyPlacesStatus(e, place_name, property)}
                        switchStatus={(new_status, transitionTime)=>{switchState(place_name, new_status, transitionTime)}}
                        open_place_editor={()=>{
                            set_edited_place_name(place_name);
                        }}/>
        );

    let biome_options_html = [];
    for(let biome_name in props.biomes){
        biome_options_html.push(<option key={biome_name+"-option"} value={biome_name}>{biome_name}</option>);
    }

    let mood_buttons = Object.keys(props.moods).map((mood_name) =>
        <button key={mood_name+"-btn"}
                className={'btn btn-'+(current_mood==mood_name?'':'outline-')+'primary btn-sm'}
                >
            <a href='#' className='text-decoration-none text-reset text-capitalize' onClick={()=>{
                localStorage.setItem("current_mood", mood_name);
                set_current_mood(mood_name);
                updateMoodAudio();
                }}>
                {mood_name}
            </a>
            {mood_name!="none" && <a href='#' className='icon-link text-decoration-none text-reset ms-2' onClick={()=>{set_edited_mood_name(mood_name);set_right_editor_mode("mood")}}>
                <i className="fa-solid fa-square-pen"></i>
            </a>}
        </button>
    );

    return (
        <div className='h-100 d-flex flex-column gap-2'>
            <div className='card text-bg-light small'>
                <div className='card-body py-0'>
                    <div className='row'>
                        <div className='col-12 col-md-6 d-flex align-items-center justify-content-between justify-content-md-start gap-md-3 gap-1 p-2 flex-wrap'>
                            <div className='text-nowrap'>Time of day:</div>
                            <RadioButton val="morning" 
                                    onChange={(e)=>{
                                        localStorage.setItem("time_of_day", e.target.value);
                                        set_time_of_day(e.target.value);
                                        reloadAudio();
                                    }}
                                    checked={time_of_day=="morning"}/>
                            <RadioButton val="day" 
                                    onChange={(e)=>{
                                        localStorage.setItem("time_of_day", e.target.value);
                                        set_time_of_day(e.target.value);
                                        reloadAudio();
                                    }}
                                    checked={time_of_day=="day"}/>
                            <RadioButton val="evening" 
                                    onChange={(e)=>{
                                        localStorage.setItem("time_of_day", e.target.value);
                                        set_time_of_day(e.target.value);
                                        reloadAudio();
                                    }}
                                    checked={time_of_day=="evening"}/>
                            <RadioButton val="night" 
                                    onChange={(e)=>{
                                        localStorage.setItem("time_of_day", e.target.value);
                                        set_time_of_day(e.target.value);
                                        reloadAudio();
                                    }}
                                    checked={time_of_day=="night"}/>
                        </div>
                        {/* <select className="form-select form-select-sm"
                                value={time_of_day}
                                onChange={(e)=>{
                                    localStorage.setItem("time_of_day", e.target.value);
                                    set_time_of_day(e.target.value);
                                    reloadAudio();
                                }}>
                            <option value="morning">Morning</option>
                            <option value="day">Day</option>
                            <option value="evening">Evening</option>
                            <option value="night">Night</option>
                        </select> */}
                        <div className='col-12 col-md-6 d-flex align-items-center gap-2 p-2'>
                            <div>Biome: </div>
                            <select className="form-select form-select-sm text-capitalize"
                                    style={{cursor:"pointer"}}
                                    value={active_biome}
                                    onChange={(e)=>{
                                        localStorage.setItem("active_biome", e.target.value);
                                        set_active_biome(e.target.value);
                                        reloadAudio();
                                    }}>
                                {biome_options_html}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card flex-grow-1'>
                <div className='card-header small'>
                    <div className='d-flex justify-content-between'>
                        Environment
                        <button className="btn btn-outline-danger btn-sm"
                                onClick={()=>{
                                    let final_places_status = {...props.places_status};
                                    turnOffAllPlaces(final_places_status);
                                    transitionAudio(final_places_status, localStorage.getItem('short_transition_time'));
                                    props.set_places_status(final_places_status);
                                }}>
                            Silence all <i className="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                </div>
                <div className='card-body position-relative'>
                    <div className='position-absolute top-0 start-0 bottom-0 end-0 overflow-auto p-2'>
                        <WeatherBadge   weathers={props.weathers}
                                        current_weather={current_weather}
                                        set_current_weather={set_current_weather}
                                        status={props.places_status["weather"]}
                                        switchStatus={(new_status, transitionTime)=>{switchState("weather", new_status, transitionTime)}}
                                        modify_status={(e, property)=>modifyPlacesStatus(e, "weather", property)}
                                        set_edited_weather_name={(edited_weather_name)=>{set_edited_weather_name(edited_weather_name);set_right_editor_mode("weather")}}
                                        addWeather={()=>{
                                            let new_weather_name = props.addWeather();
                                            set_edited_weather_name(new_weather_name);
                                            set_right_editor_mode("weather");
                                        }}/>
                        <div className='p-3 d-flex flex-row flex-wrap justify-content-center align-items-start gap-2'>
                            {places_badges}
                        </div>
                        <div className='d-flex justify-content-center mt-3'>
                            <button className="btn btn-outline-primary btn-lg"
                                    onClick={()=>{
                                        set_edited_place_name(props.addPlace());
                                    }}>
                                Add place
                            </button>
                            {/* <button className="btn btn-outline-primary btn-lg"
                                    onClick={()=>{
                                        AudioManager.playTest();
                                    }}>
                                Play test
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className={'card'+(mood_opened?' flex-grow-1':'')}>
                <div className='card-header small'>
                    <div className='d-flex gap-4'>
                        <a href='#' onClick={()=>set_mood_opened(!mood_opened)} className="icon-link text-decoration-none text-reset"><i className={"fa-solid fa-chevron-"+(mood_opened?"down":"up")}></i></a>
                        Mood
                        <div className='d-flex flex-row align-items-center gap-2 flex-grow-1'>
                            <i className="fa-solid fa-volume-low"></i>
                            <input type="range" value={mood_volume}
                                    onChange={(e)=>{
                                        set_mood_volume(e.target.value);
                                        localStorage.setItem("mood_volume", e.target.value);
                                        updateMoodAudio();
                                    }}
                                    className="form-range"
                                    min="0" max="1" step='.05'/>
                            <i className="fa-solid fa-volume-high"></i>
                        </div>
                    </div>
                </div>
                {mood_opened && <div className='card-body'>
                    <div className='d-flex flex-row gap-2 align-items-center'>
                        {mood_buttons}
                        <button className="btn btn-outline-primary btn-sm" onClick={()=>{let new_mood_name = props.addMood(); set_edited_mood_name(new_mood_name);set_right_editor_mode("mood")}}>+</button>
                    </div>
                </div>}
            </div>
            {edited_place_name!="" && <PlaceEditor  edited_place_name={edited_place_name}
                                                    set_edited_place_name={set_edited_place_name}
                                                    places={props.places}
                                                    sounds={props.sounds}
                                                    weathers={props.weathers}
                                                    moods={props.moods}
                                                    savePlace={props.savePlace}
                                                    deletePlace={props.deletePlace}
                                                    closeEditor={()=>set_edited_place_name("")}
                                                    reloadAudio={reloadAudio}/>}
            {(edited_weather_name!=""&&right_editor_mode=="weather") && 
                <WeatherEditor  weathers={props.weathers}
                                edited_weather_name={edited_weather_name}
                                changeWeather={props.changeWeather}
                                deleteWeather={(weather_name)=>{
                                    props.deleteWeather(weather_name);
                                    if(current_weather==weather_name){
                                        set_current_weather("none");
                                        localStorage.setItem("current_weather", "none");
                                    }
                                }}
                                sounds={props.sounds}
                                closeEditor={()=>set_edited_weather_name("")}/>}
            {(edited_mood_name!=""&&right_editor_mode=="mood") && 
                <MoodEditor edited_mood_name={edited_mood_name}
                            sound_name={props.moods[edited_mood_name].sound}
                            changeMoodName={props.changeMoodName}
                            changeMoodSound={props.changeMoodSound}
                            deleteMood={(mood_name)=>{
                                props.deleteMood(mood_name);
                                if(mood_name==current_mood){
                                    set_current_mood("none");
                                }
                            }}
                            closeEditor={()=>set_edited_mood_name("")}/>}
        </div>
    )
}

export default MainPage