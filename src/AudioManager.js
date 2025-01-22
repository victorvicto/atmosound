class AudioManager {
    constructor(){
        this.places = {};
        this.moods = {}; // TODO manage all of this
    }

    startPlace(placeName, volume, muffleAmount, transitionTime){
        let lowpassFreq = this.muffleAmountToFreq(muffleAmount);
        if(this.places[placeName]==null){
            this.places[placeName] = new PlaceSTM(placeName, lowpassFreq, Howler.ctx.destination);
            this.places[placeName].start();
        }
        this.places[placeName].transitionVolume(volume, transitionTime);
        this.places[placeName].transitionLowpass(lowpassFreq, transitionTime);
    }

    stopPlace(placeName, transitionTime){
        if(this.places[placeName]==null){
            return;
        }
        this.places[placeName].cleanUp(transitionTime);
        delete this.places[placeName];
    }

    stopAllPlaces(transitionTime){
        for(let placeName in this.places){
            this.stopPlace(placeName, transitionTime);
        }
    }

    refresh(time){
        let runningPlacesInfo = [];
        for(let placeName of Object.keys(this.places)){
            runningPlacesInfo.push({name:placeName,
                                    volume:this.places[placeName].gainNode.gain.value,
                                    lowpassFreq:this.places[placeName].lowpassNode.frequency.value});
        }
        this.stopAllPlaces(time);
        for(let placeInfo of runningPlacesInfo){
            this.startPlace(placeInfo.name, placeInfo.volume, placeInfo.lowpassFreq, time);
        }
    }

    start(){
        Howler.volume(1);
        console.log("starting audio context");
        let first_sound = new Howl({
            src: ["https://v1.cdnpk.net/videvo_files/audio/premium/audio0130/watermarked/MagicCartoon%20CTE01_92.5_preview.mp3", 'https://actions.google.com/sounds/v1/cartoon/pop.ogg'],
            autoplay: false
        });
        first_sound.on('end', function(){
            first_sound.unload();
        });
        first_sound.play();
    }

    muffleAmountToFreq(muffleAmount){
        let maxFreq = 8000;
        return maxFreq*((1-muffleAmount)**3);
    }
}