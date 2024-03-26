import { useState } from "react";
import EditableText from "./EditableText";

function SoundPack({sound_pack_name, sound_pack, changeSoundPack, changeSoundPackName, deleteSoundPack}){
    const [is_open, set_is_open] = useState(false);

    function changeSoundFile(sound_file_index, property, new_value){
        let new_sound_pack = {...sound_pack};
        new_sound_pack.sound_files[sound_file_index][property] = new_value;
        changeSoundPack(sound_pack_name, new_sound_pack);
    }

    function addSoundFile(){
        let new_sound_pack = {...sound_pack};
        new_sound_pack.sound_files.push({
            url: "",
            volume_mul: 1
        });
        changeSoundPack(sound_pack_name, new_sound_pack);
    }

    function deleteSoundFile(sound_file_index){
        let new_sound_pack = {...sound_pack};
        new_sound_pack.sound_files.splice(sound_file_index, 1);
        changeSoundPack(sound_pack_name, new_sound_pack);
    }

    function changeBiomePresence(biome_name, new_value){
        let new_sound_pack = {...sound_pack};
        new_sound_pack.biome_presences[biome_name] = new_value;
        changeSoundPack(sound_pack_name, new_sound_pack);
    }

    // async function set_url(i, url){
    //     let final_url = url;
    //     if(url.includes("::")){
    //         let [api, sound_id] = url.split("::");
    //         if(api=="fs"){
    //             let key = localStorage.getItem("freesound_api_key");
    //             if(key!=null && key!=""){
    //                 const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
    //                 const previews = await resp.json();
    //                 console.log(previews);
    //                 if("previews" in previews){
    //                     final_url = previews.previews["preview-hq-mp3"];
    //                 }
    //             }
    //         }
    //     }
    //     changeSoundFile(i, "url", final_url);
    // }
    
    console.log(sound_pack.sound_files);
    const urls_html = sound_pack.sound_files.map((sound_file, i)=>
        <li key={sound_pack_name+"-sound-file-"+i} className="list-group-item">
            <div className="row">
                <div className="col-11 d-flex flex-column gap-2">
                    <div className="pe-2 overflow-hidden">
                        <EditableText   base_text={sound_file.url}
                                        edit_prompt={"Enter the URL of the sound file"}
                                        applyChange={(new_url)=>changeSoundFile(i, "url", new_url)}/>
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                        <audio controls className="w-100">
                            <source src={sound_file.url} type="audio/mpeg"/>
                            Your browser does not support the audio element.
                        </audio>
                        <div className="d-flex flex-row align-items-center gap-2">
                            <small>Volume multiplier</small>
                            <input type='number' className="form-control form-control-sm"
                                    value={sound_file.volume_mul}
                                    onChange={(e)=>changeSoundFile(i, "volume_mul", e.target.value)}
                                    min={0} max={2} step={0.05}/>
                        </div>
                    </div>
                </div>
                <div className="col-1">
                    <button type="button" className="btn btn-outline-danger h-100 w-100"
                            onClick={()=>{
                                if(confirm("Are you sure you want to delete this sound file?")){
                                    deleteSoundFile(i);
                                }
                            }}><i className="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </li>        
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