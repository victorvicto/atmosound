import {Howl, Howler} from 'howler';

class SoundPlayer {
    constructor(url, volume, outputNode){
        
        this.gainNode = Howler.ctx.createGain();
        gainNode.gain.value = volume;
        this.gainNode.connect(outputNode);

        this.final_url = this.finaliseUrl(url);
        this.howl = new Howl({
            src: [url],
            autoplay: false,
            volume: 1,
        });
        howl._sounds[0]._node.disconnect();
        howl._sounds[0]._node.connect(this.gainNode);
        
        this.howl.on('end', function(){
            this.destruct();
        });
    }

    play(){
        this.howl.play();
    }

    destruct(){
        this.howl.unload();
        this.gainNode.disconnect();
    }

    async finaliseUrl(url){
        if(url.includes("::")){
            let [prefix, sound_id] = url.split("::");
            if(prefix=="fs"){
                let key = localStorage.getItem("freesound_api_key");
                if(key!=null && key!=""){
                    const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
                    const previews = await resp.json();
                    console.log(previews);
                    if("previews" in previews){
                        return previews.previews["preview-hq-mp3"];
                    }
                }
            }
            // I have my own personal ytdl backend
            // not sure how to make this functionality public without backend
            // maybe I upload backend and only give access to api codes
            // I give an api code to patreons
            else if(prefix=="yt"){
                return "http://localhost:5000/yt/"+sound_id;
                // const resp = await fetch("https://yt-source.nico.dev/"+sound_id);
                // const info = await resp.json();
                // console.log(info);
                // if("formats" in info){
                //     if("audio/webm" in info["formats"]){
                //         let final_url = info["formats"]["audio/webm"];
                //         createAndAddStream(final_url, playing_place);
                //     } else if("audio/mp4" in info["formats"]){
                //         let final_url = info["formats"]["audio/mp4"];
                //         createAndAddStream(final_url, playing_place);
                //     }
                // }
            }
        }
        
        return url;
    }
}