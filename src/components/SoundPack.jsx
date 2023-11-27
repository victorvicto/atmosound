import { useState } from "react";

function SoundPack({sound_pack_name, sound_pack}){
    const [is_open, set_is_open] = useState(false);

    const urls_html = sound_pack.sound_files.map((sound_file, i)=>
        <li key={sound_pack_name+"-sound-file-"+i} className="list-group-item d-flex flex-column gap-2 p-2">
            <input type='text' className={"form-control form-control-sm"} value={sound_file.url}/>
            <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                <audio controls className="w-100">
                    <source src={sound_file.url} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
                <div className="d-flex flex-row align-items-center gap-2">
                    <small>Volume multiplier</small>
                    <input type='number' className="form-control form-control-sm" value={sound_file.volume_mul} min={0} max={2} step={0.05}/>
                </div>
            </div>
        </li>
    );

    const biomes_html = Object.entries(sound_pack.biome_presences).map(([biome_name, biome_present])=>
        <div key={sound_pack_name+"-biome-"+biome_name+"-check"} className="d-flex flex-row align-items-center gap-1">
            <input type="checkbox" checked={biome_present}/>
            <small>{biome_name}</small>
        </div>
    );

    return (
        <div className={'card shadow-sm'}>
            <div className="card-header d-flex justify-content-between">
                <h5 className="card-title m-0">{sound_pack_name}</h5>
                <a href="#" onClick={()=>set_is_open(!is_open)}><i className={"fa-solid fa-chevron-"+(is_open?"up":"down")}></i></a>
            </div>
            {is_open &&
            <ul className="list-group list-group-flush">
                {urls_html}
                <li className="list-group-item">
                    <a href="#">+ Add file</a>
                </li>
            </ul>}
            <div className="card-footer d-flex flex-wrap gap-3">
                {biomes_html}
            </div>
        </div>
    )
}

export default SoundPack;