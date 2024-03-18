import { useState } from 'react'

import * as AudioManager from "../AudioManager";

import PlaceBadge from './PlaceBadge.jsx';
import PlaceEditor from './PlaceEditor.jsx';
import WeatherBadge from './WeatherBadge.jsx';
import WeatherEditor from './WeatherEditor.jsx';

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

    const [edited_place_name, set_edited_place_name] = useState("");
    const [edited_weather_name, set_edited_weather_name] = useState("");
    const [active_biome, set_active_biome] = useState(instantiateActiveBiome);
    const [time_of_day, set_time_of_day] = useState(instantiateTimeOfDay);
    const [current_weather, set_current_weather] = useState(instantiateCurrentWeather);

    async function getSoundUrls(sound_name){
        let urls = [];
        for(let sound_pack of props.sounds[sound_name].sound_packs){
            if(sound_pack.biome_presences[localStorage.getItem("active_biome")]){
                for(let sound_file of sound_pack.sound_files){
                    urls.push(sound_file.url);
                }
            }
        }
        return urls;
    }

    function reloadAudio(){
        for(const [place_name, place_status] of Object.entries(props.places_status)){
            AudioManager.fade_out_place(place_name);
        }
        transitionAudio(props.places_status, false);
    }

    function transitionAudio(final_places_status, clear_fading_out=true){
        if(clear_fading_out) AudioManager.clear_fading_out_places();
        for(const [place_name, place_status] of Object.entries(final_places_status)){
            let sounds_list;
            if(place_name=="weather"){
                sounds_list = props.weathers[current_weather].sounds_list;
            } else {
                sounds_list = props.places[place_name].sounds_list;
            }
            if(place_status.state=="off"){
                if(clear_fading_out) AudioManager.fade_out_place(place_name);
            } else if(place_status.state=="on"){
                AudioManager.start_place(place_name, sounds_list, 0, 1, getSoundUrls);
            } else if(place_status.state=="muffled"){
                AudioManager.start_place(place_name, sounds_list, 
                    place_status.muffle_amount, place_status.volume, getSoundUrls);
            }
        }
    }
    
    function turnOffAllPlaces(final_places_status){
        for(let place_name in final_places_status){
            final_places_status[place_name].state = "off";
        }
    }

    function switchState(place_name, new_state){
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
        transitionAudio(final_places_status);
        props.set_places_status(final_places_status);
    }

    function modifyPlacesStatus(event, place_name, property){
        let new_places_status = {...props.places_status};
        new_places_status[place_name][property] = event.target.value;
        transitionAudio(new_places_status);
        props.set_places_status(new_places_status);
    }

    const places_badges = Object.entries(props.places).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name}
                        place_name={place_name}
                        place_status={props.places_status[place_name]}
                        modify_status={(e, property)=>modifyPlacesStatus(e, place_name, property)}
                        switchStatus={(new_status)=>{switchState(place_name, new_status)}}
                        open_place_editor={()=>{
                            set_edited_place_name(place_name);
                        }}/>
        );

    let biome_options_html = [];
    for(let biome_name in props.biomes){
        biome_options_html.push(<option key={biome_name+"-option"} value={biome_name}>{biome_name}</option>);
    }

    return (
        <>
        <div className='card mb-3 text-bg-light'>
            <div className='card-body d-flex align-items-center gap-2 p-2'>
                <small className='text-nowrap'>Time of day: </small>
                <select className="form-select form-select-sm"
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
                </select>
                <small>Biome: </small>
                <select className="form-select form-select-sm text-capitalize"
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
        <WeatherBadge   weathers={props.weathers}
                        current_weather={current_weather}
                        set_current_weather={set_current_weather}
                        status={props.places_status["weather"]}
                        set_edited_weather_name={set_edited_weather_name}
                        addWeather={()=>{
                            let new_weather_name = props.addWeather();
                            set_edited_weather_name(new_weather_name);
                        }}/>
        <div className='p-2 p-md-5 d-flex flex-row flex-wrap justify-content-center align-items-start gap-2'>
            {places_badges}
        </div>
        <div className='d-flex justify-content-center mt-3'>
            <button className="btn btn-outline-primary btn-lg"
                    onClick={()=>{
                        set_edited_place_name(props.addPlace());
                    }}>
                Add place
            </button>
            <button className="btn btn-outline-primary btn-lg"
                    onClick={()=>{
                        AudioManager.playTest();
                    }}>
                Play test
            </button>
            <input type="file" id="fileInput"></input>
        </div>
        {edited_place_name!="" && <PlaceEditor  edited_place_name={edited_place_name}
                                                set_edited_place_name={set_edited_place_name}
                                                places={props.places}
                                                sounds={props.sounds}
                                                weathers={props.weathers}
                                                savePlace={props.savePlace}
                                                deletePlace={props.deletePlace}
                                                closeEditor={()=>set_edited_place_name("")}
                                                reloadAudio={reloadAudio}/>}
        {edited_weather_name!="" && <WeatherEditor  weathers={props.weathers}
                                                    edited_weather_name={edited_weather_name}
                                                    changeWeather={props.changeWeather}
                                                    deleteWeather={()=>console.log("delete")}
                                                    sounds={props.sounds}
                                                    closeEditor={()=>set_edited_weather_name("")}/>}
        </>
    )
}

export default MainPage