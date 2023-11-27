import SoundPack from './SoundPack'

function SoundCard({sound_name, sound_info}){

    const sound_packs_html = sound_info.sound_packs.map((sound_pack, i) => 
            <li className="list-group-item d-flex flex-column gap-2 p-2">
                <SoundPack key={sound_name+"-sound-pack-"+i}
                        sound_pack={sound_pack}/>     
            </li>
        );

    return (
        <div className={'card shadow-sm'}>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between gap-2 p-2">
                    <h5 className={"card-title mb-0 text-capitalize"}>{sound_name}</h5>
                    <i className="fa-solid fa-chevron-down"></i>
                </li>
                {sound_packs_html}
            </ul>
        </div>
    )
}

export default SoundCard;