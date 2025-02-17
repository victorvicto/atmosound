import React from 'react';
import PlaceBadge from './PlaceBadge';
import WeatherBadge from './WeatherBadge';

const EnvironmentPanel = ({ places, activePlace, shutPlace, updateAdjacentPlaces, set_edited_place_name, set_edited_weather_name, set_right_editor_mode, addPlace }) => {
    const places_badges = Object.entries(places).map(([place_name, place_info]) => 
        <PlaceBadge key={place_name+"-badge"}
                    place_name={place_name}
                    open_place_editor={() => set_edited_place_name(place_name)} />
    );

    return (
        <div className='card flex-grow-1'>
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
                        {places_badges}
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <button className="btn btn-outline-primary btn-lg"
                                onClick={() => set_edited_place_name(addPlace())}>
                            Add place
                        </button>
                        {/* <button className="btn btn-outline-primary btn-lg"
                                onClick={() => {
                                    AudioManager.playTest();
                                }}>
                            Play test
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentPanel;