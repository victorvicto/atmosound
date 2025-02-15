import { useState } from 'react'

import PlaceBadge from './PlaceBadge.jsx';
import PlaceEditor from './PlaceEditor.jsx';
import WeatherBadge from './WeatherBadge.jsx';
import WeatherEditor from './WeatherEditor.jsx';
import MoodEditor from './MoodEditor';
import TODRadioButton from './TODRadioButton.jsx';
import { useDataTree } from '../DataTreeContext.jsx';

function MainPage(props) {

    const { places, biomes, moods } = useDataTree();

    const [edited_place_name, set_edited_place_name] = useState("");
    const [edited_weather_name, set_edited_weather_name] = useState("");
    const [edited_mood_name, set_edited_mood_name] = useState("");
    const [right_editor_mode, set_right_editor_mode] = useState("");
    const [mood_opened, set_mood_opened] = useState(false);
    const [mood_volume, set_mood_volume] = useState(localStorage.getItem("mood_volume") || 1);

    const [has_been_started, set_has_been_started] = useState(false);

    function startAudioContext(){
        Howler.volume(1);
        console.log("starting audio context");
        let first_sound = new Howl({
            src: ["https://v1.cdnpk.net/videvo_files/audio/premium/audio0130/watermarked/MagicCartoon%20CTE01_92.5_preview.mp3", 'https://actions.google.com/sounds/v1/cartoon/pop.ogg'],
            autoplay: false
        });
        first_sound.on('end', function(){
            first_sound.unload();
        });
        first_sound.play();
    }

    // Making sure audio starts playing when loading page to previous setting activation
    if(!has_been_started){
        return (
            <div className='d-flex justify-content-center p-5'>
                <button type="button" className='btn btn-primary btn-lg m-5 shadow shadow-md'
                        onClick={()=>{
                                startAudioContext();
                                set_has_been_started(true);
                            }}>
                    Start audio context
                </button>
            </div>
        );
    }
    
    function turnOffAllPlaces(final_places_status){
        for(let place_name in final_places_status){
            final_places_status[place_name].state = "off";
        }
    }

    const places_badges = Object.entries(places).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name+"-badge"}
                        place_name={place_name}
                        open_place_editor={()=>{
                            set_edited_place_name(place_name);
                        }}/>
        );

    let biome_options_html = [];
    for(let biome_name in biomes){
        biome_options_html.push(<option key={biome_name+"-option"} value={biome_name}>{biome_name}</option>);
    }

    let mood_buttons = Object.keys(moods).map((mood_name) =>
        <MoodBadge key={mood_name+"-badge"}
                    moodName={mood_name}/>
    );

    return (
        <div className='h-100 d-flex flex-column gap-2'>
            <div className='card text-bg-light small'>
                <div className='card-body py-0'>
                    <div className='row'>
                        <div className='col-12 col-md-6 d-flex align-items-center justify-content-between justify-content-md-start gap-md-3 gap-1 p-2 flex-wrap'>
                            <div className='text-nowrap'>Time of day:</div>
                            <TODRadioButton val="morning"/>
                            <TODRadioButton val="day"/>
                            <TODRadioButton val="evening"/>
                            <TODRadioButton val="night"/>
                        </div>
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