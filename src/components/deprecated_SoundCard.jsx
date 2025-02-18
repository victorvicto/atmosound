import { useState } from "react";

import SoundPack from './SoundPack';
import EditableText from "./EditableText";

function SoundCard({sound_name, sound_info, changeSound, deleteSound}){
    const [is_open, set_is_open] = useState(false);

    function changeSoundPack(sound_pack_name, new_sound_pack){
        let new_sound_info = {...sound_info};
        let new_sound_packs = {...new_sound_info.sound_packs};
        new_sound_packs[sound_pack_name] = new_sound_pack;
        new_sound_info.sound_packs = new_sound_packs;
        changeSound(sound_name, sound_name, new_sound_info);
    }

    function changeSoundPackName(old_pack_name, new_pack_name){
        let new_sound_info = {...sound_info};
        let new_sound_packs = {...new_sound_info.sound_packs};
        new_sound_packs[new_pack_name] = new_sound_packs[old_pack_name];
        delete new_sound_packs[old_pack_name];
        new_sound_info.sound_packs = new_sound_packs;
        changeSound(sound_name, sound_name, new_sound_info);
    }

    function addSoundPack(){
        let new_sound_pack_name = prompt("New sound pack name:").toLowerCase();
        let new_sound_info = {...sound_info};
        let new_sound_packs = {...new_sound_info.sound_packs};
        new_sound_packs[new_sound_pack_name] = {
            sound_files: [],
            biome_presences: {}
        };
        new_sound_info.sound_packs = new_sound_packs;
        changeSound(sound_name, sound_name, new_sound_info);
    }

    function deleteSoundPack(sound_pack_name){
        let new_sound_info = {...sound_info};
        let new_sound_packs = {...new_sound_info.sound_packs};
        delete new_sound_packs[sound_pack_name];
        new_sound_info.sound_packs = new_sound_packs;
        changeSound(sound_name, sound_name, new_sound_info);
    }

    // const sound_packs_html = sound_info.sound_packs.map((sound_pack, i) => 
    //         <li key={sound_name+"-sound-pack-"+i} className="list-group-item d-flex flex-column gap-2 p-2">
    //             <SoundPack sound_pack_name={"Sound pack "+i}
    //                         sound_pack={sound_pack}
    //                         changeSoundPack={changeSoundPack}
    //                         deleteSoundPack={deleteSoundPack}/>     
    //         </li>
    //     );

    let sound_packs_html = [];
    for(let sound_pack_name in sound_info.sound_packs){
        sound_packs_html.push(
            <li key={sound_name+"-sound-pack-"+sound_pack_name} className="list-group-item d-flex flex-column gap-2 p-2">
                <SoundPack sound_pack_name={sound_pack_name}
                            sound_pack={sound_info.sound_packs[sound_pack_name]}
                            changeSoundPack={changeSoundPack}
                            changeSoundPackName={changeSoundPackName}
                            deleteSoundPack={deleteSoundPack}/>     
            </li>
        )
    }

    return (
        <div className={'card shadow-sm'}>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center gap-2 p-2">
                    <h5 className={"card-title mb-0 text-capitalize"}>
                        <EditableText   base_text={sound_name}
                                        edit_prompt={"Rename sound: "}
                                        applyChange={(new_sound_name)=>changeSound(sound_name, new_sound_name, sound_info)}/>
                    </h5>
                    <a href='#' onClick={()=>set_is_open(!is_open)}><i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i></a>
                </li>
                {is_open && sound_packs_html}
                {is_open && 
                    <li className="list-group-item d-flex justify-content-between p-2">
                        <button type="button" className="btn btn-primary" onClick={addSoundPack}>Add sound pack</button>
                        <button type="button" className="btn btn-outline-danger" onClick={()=>{
                            if(confirm("Are you sure you want to delete the sound: "+sound_name+"?")){
                                deleteSound(sound_name);
                            }}}>
                                Delete sound <i className="fa-solid fa-trash"></i>
                        </button>
                    </li>
                }
            </ul>
        </div>
    )
}

export default SoundCard;