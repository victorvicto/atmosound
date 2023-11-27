import { useState } from "react";

import SoundPack from './SoundPack'

function SoundCard({sound_name, sound_info, changeSound}){
    const [is_open, set_is_open] = useState(false);

    function changeSoundPack(sound_pack_name, new_sound_pack){
        let new_sound_info = {...sound_info};
        new_sound_info.sound_packs[sound_pack_name] = new_sound_pack;
        changeSound(sound_name, sound_name, new_sound_info);
    }

    function addSoundPack(){
        let new_sound_info = {...sound_info};
        new_sound_info.sound_packs.push({
            sound_files: [],
            biome_presences: {}
        });
        changeSound(sound_name, sound_name, new_sound_info);
    }

    const sound_packs_html = sound_info.sound_packs.map((sound_pack, i) => 
            <li key={sound_name+"-sound-pack-"+i} className="list-group-item d-flex flex-column gap-2 p-2">
                <SoundPack sound_pack_name={"Sound pack "+i} sound_pack={sound_pack} changeSoundPack={changeSoundPack}/>     
            </li>
        );

    return (
        <div className={'card shadow-sm'}>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center gap-2 p-2">
                    <h5 className={"card-title mb-0 text-capitalize"}>
                        {sound_name}
                        <a href='#' className='icon-link text-decoration-none ms-2' onClick={()=>{
                            let new_name = prompt("Rename sound");
                            if(new_name!=null){
                                changeSound(sound_name, new_name.toLowerCase(), sound_info)
                            }
                        }}>
                            <i className="fa-solid fa-square-pen"></i>
                        </a>
                    </h5>
                    <a href='#' onClick={()=>set_is_open(!is_open)}><i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i></a>
                </li>
                {is_open && sound_packs_html}
                {is_open && 
                    <li className="list-group-item p-2">
                        <button type="button" className="btn btn-primary" onClick={addSoundPack}>Add sound pack</button>
                    </li>
                }
            </ul>
        </div>
    )
}

export default SoundCard;