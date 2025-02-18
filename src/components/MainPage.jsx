import { useState } from 'react'

import PlaceEditor from './PlaceEditor.jsx';
import WeatherEditor from './WeatherEditor.jsx';
import MoodEditor from './MoodEditor';
import TODSelector from './TODSelector.jsx';
import BiomeSelector from './BiomeSelector.jsx';
import { useDataTree } from '../DataTreeContext.jsx';
import EnvironmentPanel from './EnvironmentPanel.jsx';
import MoodPanel from './MoodPanel.jsx';
import { useStateContext } from '../StateContext.jsx';

function MainPage() {

    const { places, biomes, moods } = useDataTree();
    const { activePlace, shutPlace, updateAdjacentPlaces } = useStateContext();

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

    return (
        <div className='h-100 d-flex flex-column gap-2'>
            <div className='card text-bg-light small'>
                <div className='card-body py-0'>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            <TODSelector/>
                        </div>
                        <div className='col-12 col-md-6'>
                            <BiomeSelector/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-grow-1'>
                <EnvironmentPanel set_edited_place_name={set_edited_place_name}
                                    set_edited_weather_name={set_edited_weather_name}
                                    set_right_editor_mode={set_right_editor_mode}/>
            </div>
            <div className={mood_opened?' flex-grow-1':''}>
                <MoodPanel set_edited_mood_name={set_edited_mood_name}
                            set_right_editor_mode={set_right_editor_mode}/>
            </div>
            {edited_place_name!="" && <PlaceEditor  edited_place_name={edited_place_name}
                                                    set_edited_place_name={set_edited_place_name}
                                                    closeEditor={()=>set_edited_place_name("")}/>}
            {(edited_weather_name!=""&&right_editor_mode=="weather") && 
                <WeatherEditor  edited_weather_name={edited_weather_name}
                                closeEditor={()=>set_edited_weather_name("")}/>}
            {(edited_mood_name!=""&&right_editor_mode=="mood") && 
                <MoodEditor edited_mood_name={edited_mood_name}
                            closeEditor={()=>set_edited_mood_name("")}/>}
        </div>
    )
}

export default MainPage