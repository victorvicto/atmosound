import { useState } from "react";
import EditableText from "./EditableText";
import SoundFileViewer from "./SoundFileViewer";

function SoundPack({sound_pack_name, soundName}){

    const { sounds, changeSound } = useDataTree();
    const sound_info = sounds[soundName];
    const sound_pack = sound_info.sound_packs[sound_pack_name];
    const [is_open, set_is_open] = useState(false);

    function changeSoundPack(sound_pack_name, new_sound_pack){
        let new_sound_info = {...sound_info};
        let new_sound_packs = {...new_sound_info.sound_packs};
        new_sound_packs[sound_pack_name] = new_sound_pack;
        new_sound_info.sound_packs = new_sound_packs;
        changeSound(soundName, soundName, new_sound_info);
    }

    function changeSoundPackName(old_pack_name, new_pack_name){
        let new_sound_info = {...sound_info};
        let new_sound_packs = {...new_sound_info.sound_packs};
        new_sound_packs[new_pack_name] = new_sound_packs[old_pack_name];
        delete new_sound_packs[old_pack_name];
        new_sound_info.sound_packs = new_sound_packs;
        changeSound(soundName, soundName, new_sound_info);
    }

    function addSoundFile(){
        let new_sound_pack = {...sound_pack};
        new_sound_pack.sound_files.push({
            url: "",
            volume_mul: 1
        });
        changeSoundPack(sound_pack_name, new_sound_pack);
    }

    function changeBiomePresence(biome_name, new_value){
        let new_sound_pack = {...sound_pack};
        new_sound_pack.biome_presences[biome_name] = new_value;
        changeSoundPack(sound_pack_name, new_sound_pack);
    }

    const urls_html = sound_pack.sound_files.map((sound_file, i)=>
        <SoundFileViewer key={sound_pack_name+"-sound-file-"+i}
                        soundName={soundName}
                        soundPackName={sound_pack_name}
                        soundFileIndex={i}/>        
    );

    const biomes_html = Object.entries(sound_pack.biome_presences).map(([biome_name, biome_present])=>
        <div key={sound_pack_name+"-biome-"+biome_name+"-check"} className="d-flex flex-row align-items-center gap-1">
            <input type="checkbox" checked={biome_present} onChange={(e)=>changeBiomePresence(biome_name, e.target.checked)}/>
            <small>{biome_name}</small>
        </div>
    );

    return (
        <div className={'card shadow-sm'}>
            <div className="card-header d-flex justify-content-between">
                <div className="d-flex flex-row align-items-center flew-wrap gap-3">
                    <h5 className="card-title m-0 text-capitalize">
                        <EditableText   base_text={sound_pack_name}
                                        edit_prompt={"New sound pack name"}
                                        applyChange={(new_pack_name)=>changeSoundPackName(sound_pack_name, new_pack_name)}/>
                    </h5>
                    <a href="#" className="icon-link text-decoration-none link-danger"
                        onClick={()=>{
                            if(confirm("Are you sure you want to delete the sound pack: "+sound_pack_name+"?")){
                                deleteSoundPack(sound_pack_name);
                            }
                        }}><i className="fa-solid fa-trash"></i></a>
                </div>
                <a href="#" onClick={()=>set_is_open(!is_open)}><i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i></a>
            </div>
            {is_open &&
            <ul className="list-group list-group-flush">
                {urls_html}
                <li className="list-group-item">
                    <a href="#" onClick={addSoundFile}>+ Add file</a>
                </li>
            </ul>}
            <div className="card-footer d-flex flex-wrap gap-3">
                {biomes_html}
            </div>
        </div>
    )
}

export default SoundPack;