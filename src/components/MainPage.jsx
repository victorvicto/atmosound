import { useState } from 'react'

import PlaceBadge from './PlaceBadge.jsx';
import PlaceCreator from './PlaceCreator.jsx';

function MainPage({places, sounds}) {

    let every_body_off = {}
    for(const [place_name, value] of Object.entries(places)){
        every_body_off[place_name] = "off";
    }
    const [places_status, set_places_status] = useState({...every_body_off});

    function switchStatus(place_name, new_status){
        let final_places_status = {...places_status};
        if(places_status[place_name]==new_status){
            final_places_status[place_name] = "off";
        } else {
            if(new_status=="on"){
                final_places_status = {...every_body_off};
                console.log(final_places_status);
                if("muffled" in places[place_name]){
                    for(const [muffled_place_name, muffle_amount] of Object.entries(places[place_name].muffled)){
                        final_places_status[muffled_place_name] = "muffled";
                        document.getElementById("place-badge-"+muffled_place_name+"-muffle-amount").value = muffle_amount;
                    }
                }
                if("distant" in places[place_name]){
                    for(const [distant_place_name, distance] of Object.entries(places[place_name].distant)){
                        final_places_status[distant_place_name] = "distant";
                        document.getElementById("place-badge-"+distant_place_name+"-distance").value = distance;
                    }
                }
            }
            final_places_status[place_name] = new_status;
        }
        console.log(final_places_status);
        set_places_status(final_places_status);
    }

    const places_badges = Object.entries(places).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name}
                        place_name={place_name}
                        place_status={places_status[place_name]}
                        switchStatus={(new_status)=>{switchStatus(place_name, new_status)}}/>
        );

    return (
        <>
        <div className='d-flex flex-row flex-wrap justify-content-center gap-2'>
            {places_badges}
        </div>
        <div className='d-flex justify-content-center mt-3'>
            <button className="btn btn-outline-primary btn-lg"
                    data-bs-toggle="modal"
                    data-bs-target="#place-creator-modal">
                Add place
            </button>
        </div>
        <PlaceCreator sounds={sounds}/>
        </>
    )
}

export default MainPage