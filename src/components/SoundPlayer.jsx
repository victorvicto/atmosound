import React, { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';
const SoundPlayer = ({ url, volume, outputNode }) => {
    
    async function finaliseUrl(url){
        if(url.includes("::")){
            let [prefix, sound_id] = url.split("::");
            if(prefix=="fs"){
                let key = localStorage.getItem("freesound_api_key");
                if(key!=null && key!=""){
                    const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
                    const previews = await resp.json();
                    if("previews" in previews){
                        return previews.previews["preview-hq-mp3"];
                    }
                }
            }

            else if(prefix=="yt"){
                return "http://localhost:5000/yt/"+sound_id;
            }
        }
        return url;
    }

    const [ howlUrl, setHowlUrl ] = useState(null);
    let howl = null;

    useEffect(() => {
        finaliseUrl(url).then((finalUrl) => {
            setHowlUrl(finalUrl);
            howl = new Howl({
                src: [finalUrl],
                volume: volume,
                onend: () => {
                    console.log("Destructing " + finalUrl);
                    howl.unload();
                },
                onload: () => {
                    console.log("Loaded " + finalUrl);
                    howl.play();
                }
            });
            howl._sounds[0]._node.disconnect();
            console.log(outputNode);
            howl._sounds[0]._node.connect(outputNode.current);
        });
    }, [url]);

    // useEffect(() => {
    //     const gainNode = Howler.ctx.createGain();
    //     gainNode.gain.value = volume;
    //     gainNode.connect(outputNode || Howler.ctx.destination);

    //     const sound = new Howl({
    //         src: [url],
    //         volume: 1,
    //         onend: () => {
    //             console.log("Destructing " + url);
    //             sound.unload();
    //             gainNode.disconnect();
    //         }
    //     });

    //     sound._sounds[0]._node.disconnect();
    //     sound._sounds[0]._node.connect(gainNode);

    //     audioRef.current = { sound, gainNode };

    //     sound.play();

    //     return () => {
    //         if (audioRef.current) {
    //             audioRef.current.sound.unload();
    //             audioRef.current.gainNode.disconnect();
    //         }
    //     };
    // }, [url, volume, outputNode]);

    return (
        <div className='card'>
            <div className='card-body'>
                <div>Url: {howlUrl}</div>
                {howl!=null && <div>Gain volume: {howl.volume}</div>}
            </div>
        </div>
    );
};

export default SoundPlayer;