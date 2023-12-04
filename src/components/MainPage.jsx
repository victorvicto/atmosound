import { useState } from 'react'

import * as AudioManager from "../AudioManager";

import PlaceBadge from './PlaceBadge.jsx';
import PlaceEditor from './PlaceEditor.jsx';

function MainPage({places, sounds, biomes, addPlace, savePlace, deletePlace, places_status, set_places_status}) {

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

    const [edited_place_name, set_edited_place_name] = useState("");
    const [active_biome, set_active_biome] = useState(instantiateActiveBiome);
    const [time_of_day, set_time_of_day] = useState(instantiateTimeOfDay);

    function getSoundUrls(sound_name){
        let urls = [];
        for(let sound_pack of sounds[sound_name].sound_packs){
            if(sound_pack.biome_presences[localStorage.getItem("active_biome")]){
                for(let sound_file of sound_pack.sound_files){
                    urls.push(sound_file.url);
                }
            }
        }
        return urls;
    }

    function reloadAudio(){
        for(const [place_name, place_status] of Object.entries(places_status)){
            AudioManager.fade_out_place(place_name);
        }
        transitionAudio(places_status, false);
    }

    function transitionAudio(final_places_status, clear_fading_out=true){
        if(clear_fading_out) AudioManager.clear_fading_out_places();
        for(const [place_name, place_status] of Object.entries(final_places_status)){
            if(place_status.state=="off"){
                if(clear_fading_out) AudioManager.fade_out_place(place_name);
            } else if(place_status.state=="on"){
                AudioManager.start_place(place_name, places[place_name].sounds_list, 0, 1, getSoundUrls);
            } else if(place_status.state=="muffled"){
                AudioManager.start_place(place_name, places[place_name].sounds_list, 
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
        let final_places_status = {...places_status};
        if(places_status[place_name].state==new_state){
            final_places_status[place_name].state = "off";
        } else {
            if(new_state=="on"){
                turnOffAllPlaces(final_places_status);
                if("muffled_list" in places[place_name]){
                    for(let muffled of places[place_name].muffled_list){
                        final_places_status[muffled.name].state = "muffled";
                        final_places_status[muffled.name].muffle_amount = muffled.muffle_amount;
                        final_places_status[muffled.name].volume = muffled.volume;
                    }
                }
            }
            final_places_status[place_name].state = new_state;
        }
        transitionAudio(final_places_status);
        set_places_status(final_places_status);
    }

    function modifyPlacesStatus(event, place_name, property){
        let new_places_status = {...places_status};
        new_places_status[place_name][property] = event.target.value;
        transitionAudio(new_places_status);
        set_places_status(new_places_status);
    }

    const places_badges = Object.entries(places).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name}
                        place_name={place_name}
                        place_status={places_status[place_name]}
                        modify_status={(e, property)=>modifyPlacesStatus(e, place_name, property)}
                        switchStatus={(new_status)=>{switchState(place_name, new_status)}}
                        open_place_editor={()=>{
                            set_edited_place_name(place_name);
                        }}/>
        );

    let biome_options_html = [];
    for(let biome_name in biomes){
        biome_options_html.push(<option key={biome_name+"-option"} value={biome_name}>{biome_name}</option>);
    }

    return (
        <>
        <div className='card m-2 text-bg-light'>
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
        <div className='d-flex flex-row flex-wrap justify-content-center align-items-start gap-2'>
            {places_badges}
        </div>
        <div className='d-flex justify-content-center mt-3'>
            <button className="btn btn-outline-primary btn-lg"
                    onClick={()=>{
                        set_edited_place_name(addPlace());
                    }}>
                Add place
            </button>
        </div>
        {edited_place_name!="" && <PlaceEditor  edited_place_name={edited_place_name}
                                                places={places}
                                                sounds={sounds}
                                                savePlace={savePlace}
                                                deletePlace={deletePlace}
                                                closeEditor={()=>set_edited_place_name("")}/>}
        </>
    )
}

export default MainPage