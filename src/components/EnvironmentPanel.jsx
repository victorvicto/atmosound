import React from 'react';
import PlaceBadge from './PlaceBadge';
import WeatherBadge from './WeatherBadge';
import { useDataTree } from '../DataTreeContext';
import { useStateContext } from '../StateContext';

const EnvironmentPanel = ({ set_edited_place_name, set_edited_weather_name, set_right_editor_mode }) => {
    const { places, addPlace } = useDataTree();
    const { activePlace, shutPlace, updateAdjacentPlaces } = useStateContext();
    
    const placeBadges = Object.entries(places).map(([place_name, place_info]) => 
        <PlaceBadge key={place_name+"-badge"}
                    place_name={place_name}
                    open_place_editor={() => set_edited_place_name(place_name)} />
    );

    return (
        <div className='card'>
            <div className='card-header small'>
                <div className='d-flex justify-content-between'>
                    Environment
                    <button className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                                shutPlace(activePlace);
                                updateAdjacentPlaces({});
                            }}>
                        Silence all <i className="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </div>
            <div className='card-body position-relative'>
                <div className='position-absolute top-0 start-0 bottom-0 end-0 overflow-auto p-2'>
                    <WeatherBadge set_edited_weather_name={(edited_weather_name) => {
                            set_edited_weather_name(edited_weather_name);
                            set_right_editor_mode("weather");
                        }} />
                    <div className='p-3 d-flex flex-row flex-wrap justify-content-center align-items-start gap-2'>
                        {placeBadges}
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <button className="btn btn-outline-primary btn-lg"
                                onClick={() => set_edited_place_name(addPlace())}>
                            Add place
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentPanel;