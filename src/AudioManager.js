import {Howl, Howler} from 'howler';
import SoundTrack from './SoundTrack.js';
import PlaceSTM from './PlaceSTM.js';

export default class AudioManager {
    constructor(){
        this.places = {};
        this.moodSoundTrack = null;
    }

    startMood(moodName, volume){
        if(this.moodSoundTrack!=null){
            this.moodSoundTrack.slowKill(localStorage.getItem('short_transition_time'));
        }
        let soundName = JSON.parse(localStorage.getItem('moods'))[moodName].sound;
        for(const [placeName, place] of Object.entries(this.places)){
            if(place.gainNode.gain.value==1 && place.filterNode.frequency.value==this.muffleAmountToFreq(0)){
                let moodOverride = this.getPlaceMoodOverride(placeName);
                if(moodOverride!=null){
                    soundName = moodOverride;
                    break;
                }
            }
        }
        this.moodSoundTrack = new SoundTrack(soundName, 0, volume, Howler.ctx.destination);
        this.moodSoundTrack.start();
    }

    getPlaceMoodOverride(placeName){
        if(placeName=="weather"){
            return null;
        }
        let moodName = localStorage.getItem('current_mood');
        let places = JSON.parse(localStorage.getItem('places'));
        if(moodName in places[placeName].mood_overrides){
            return places[placeName].mood_overrides[moodName];
        }
        return null;
    }

    changeMoodVolume(newVolume, transitionTime){
        if(this.moodSoundTrack)
            this.moodSoundTrack.changeVolume(newVolume, transitionTime);
    }

    startPlace(placeName, volume, muffleAmount, transitionTime){
        let lowpassFreq = this.muffleAmountToFreq(muffleAmount);
        if(this.places[placeName]==null){
            this.places[placeName] = new PlaceSTM(placeName, lowpassFreq, Howler.ctx.destination);
            this.places[placeName].start();
        }
        this.places[placeName].transitionVolume(volume, transitionTime);
        this.places[placeName].transitionLowpass(lowpassFreq, transitionTime);

        console.log(this.places);

        // Switching mood if override doesn't match current mood
        let moodOverride = this.getPlaceMoodOverride(placeName);
        if(moodOverride!=null && moodOverride!=this.moodSoundTrack.soundName){
            this.startMood(localStorage.getItem('current_mood'), localStorage.getItem('mood_volume'));
        }
    }

    stopPlace(placeName, transitionTime){
        console.log("stopping "+placeName);
        console.log(this.places); // TODO: WHY IS THIS EMPTY WHEN TRYING TO TURN OFF A PLACE??
        if(this.places[placeName]==null){
            return;
        }

        this.places[placeName].cleanUp(transitionTime);
        delete this.places[placeName];
    }

    stopAllPlaces(transitionTime){
        console.log("stopping all places");
        for(let placeName in this.places){
            this.stopPlace(placeName, transitionTime);
        }
    }

    refresh(time){
        let runningPlacesInfo = [];
        for(let placeName in this.places){
            runningPlacesInfo.push({name:placeName,
                                    volume:this.places[placeName].gainNode.gain.value,
                                    lowpassFreq:this.places[placeName].lowpassNode.frequency.value});
        }
        this.stopAllPlaces(time);
        for(let placeInfo of runningPlacesInfo){
            this.startPlace(placeInfo.name, placeInfo.volume, placeInfo.lowpassFreq, time);
        }
        this.startMood(localStorage.getItem('current_mood'), localStorage.getItem('mood_volume'));
    }

    startAudioContext(){
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