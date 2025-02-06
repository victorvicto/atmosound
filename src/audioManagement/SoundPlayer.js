import {Howl, Howler} from 'howler';

export default class SoundPlayer {
    constructor(url, volume, outputNode){
        console.log("SoundPlayer created for "+url);
        this.gainNode = Howler.ctx.createGain();
        this.gainNode.gain.value = volume;
        this.gainNode.connect(outputNode);
        this.wasPrepped = false;
        this.todoOnceLoaded = null;
        this.prep(url);
    }

    async prep(url){
        this.final_url = await this.finaliseUrl(url);
        this.howl = new Howl({
            src: [this.final_url],
            autoplay: false,
            volume: 1,
        });
        this.howl._sounds[0]._node.disconnect();
        this.howl._sounds[0]._node.connect(this.gainNode);
        
        this.howl.on('end', ()=>{
            console.log("Destructing "+this.final_url);
            this.destruct();
        });
        this.wasPrepped = true;
        this.howl.on('load', ()=>{
            this.todoOnceLoaded();
        });
    }

    play(){
        console.log("Playing "+this.final_url);
        this.howl.play();
    }

    doSomethingOnceLoaded(something){
        if(this.wasPrepped){
            if(this.howl.state()=="loaded"){
                something();
            } else {
                this.howl.on('load', ()=>{
                    something();
                });
            }
        }else{
            this.todoOnceLoaded = something;
        }
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