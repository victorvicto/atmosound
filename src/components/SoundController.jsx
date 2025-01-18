import { useState } from "react";

function SoundController({sound_file, changeSoundFile}) {

    const [sound_loading, set_sound_loading] = useState(false);
    const [howl, set_howl] = useState(null);

    useEffect(() => {
        set_sound_loading(true);
        let h = new Howl({
            src: [sound_file.url],
            autoplay: false,
            volume: sound_file.volume_mul,
            html5: false
        });
        h.onload(()=>{
            set_howl(h);
            set_sound_loading(false);
        })
    }, []);

    if(sound_loading){
        return (<h1>Loading...</h1>);
    }

    return (
        <>
            <h1>Loaded!</h1>
        </>
    );
}

export default SoundController;