import SoundCard from './SoundCard'

function SoundsLibPage({sounds, addSound, changeSound, deleteSound}){
    const sound_cards = Object.entries(sounds).map(([sound_name, sound_info]) => 
            <SoundCard key={sound_name+'-soundcard'}
                        sound_name={sound_name}
                        sound_info={sound_info}
                        changeSound={changeSound}
                        deleteSound={deleteSound}/>
        );

    return (
        <>
        <div className='d-flex flex-column gap-3'>
            {sound_cards}
        </div>
        <div className='d-flex justify-content-center mt-3'>
            <button className="btn btn-outline-primary btn-lg" onClick={addSound}>
                Add Sound
            </button>
        </div>
        </>
    )
}

export default SoundsLibPage;