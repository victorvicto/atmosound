import SoundCard from './SoundCard'

function SoundsLibPage({sounds}){
    const sound_cards = Object.entries(sounds).map(([sound_name, sound_info]) => 
            <SoundCard key={sound_name+'-soundcard'} sound_name={sound_name}/>
        );

    return (
        <>
        <div className='d-flex flex-column gap-2'>
            {sound_cards}
        </div>
        <div className='d-flex justify-content-center mt-3'>
            <button className="btn btn-outline-primary btn-lg"
                    data-bs-toggle="modal"
                    data-bs-target="#place-creator-modal">
                Add Sound
            </button>
        </div>
        </>
    )
}

export default SoundsLibPage;