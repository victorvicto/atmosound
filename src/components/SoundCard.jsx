function SoundCard({sound_name, sound_info}){
    return (
        <div className={'card shadow-sm'}>
            <div className='card-body d-flex flex-row gap-2 align-items-center'>
                <h5 className={"card-title mb-0 text-capitalize"}>{sound_name}</h5>
                <i className="fa-solid fa-chevron-down"></i>
            </div>
        </div>
    )
}

export default SoundCard;