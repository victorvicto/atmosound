import { useDataTree } from '../DataTreeContext';
import SoundCard from './SoundCard'

function SoundsLibPage(){

    const {sounds, addSound } = useDataTree();
    
    const sound_cards = Object.entries(sounds).map(([sound_name]) => 
            <SoundCard key={sound_name+'-soundcard'}
                        sound_name={sound_name}/>
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