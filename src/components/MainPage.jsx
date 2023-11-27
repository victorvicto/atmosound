import { useState } from 'react'

import PlaceBadge from './PlaceBadge.jsx';
import PlaceEditor from './PlaceEditor.jsx';

function MainPage({places, sounds, addPlace, savePlace, deletePlace, places_status, set_places_status}) {

    const [edited_place_name, set_edited_place_name] = useState(""); // "" means no place is being edited
    
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
                    }
                }
            }
            final_places_status[place_name].state = new_state;
        }
        set_places_status(final_places_status);
    }

    function modifyPlacesStatus(event, place_name, property){
        let new_places_status = {...places_status};
        new_places_status[place_name][property] = event.target.value;
        set_places_status(new_places_status);
    }

    const places_badges = Object.entries(places).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name}
                        place_name={place_name}
                        place_status={places_status[place_name]}
                        modify_status={(e, property)=>modifyPlacesStatus(e, place_name, property)}
                        switchStatus={(new_status)=>{switchState(place_name, new_status)}}
                        open_place_editor={()=>set_edited_place_name(place_name)}/>
        );

    return (
        <>
        <div className='d-flex flex-row flex-wrap justify-content-center align-items-start gap-2'>
            {places_badges}
        </div>
        <div className='d-flex justify-content-center mt-3'>
            <button className="btn btn-outline-primary btn-lg"
                    onClick={()=>set_edited_place_name(addPlace())}>
                Add place
            </button>
        </div>
        {edited_place_name!="" && <PlaceEditor edited_place_name={edited_place_name}
                                                places={places}
                                                sounds={sounds}
                                                savePlace={savePlace}
                                                deletePlace={deletePlace}
                                                closeEditor={()=>set_edited_place_name("")}/>}
        </>
    )
}

export default MainPage