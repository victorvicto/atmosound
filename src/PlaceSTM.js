import SoundTrack from './SoundTrack.js';
import {Howler} from 'howler';

// Place SoundTrack Manager
export default class PlaceSTM {
    constructor(placeName, lowpassFreq, outputNode){
        this.placeName = placeName;
        this.gainNode = Howler.ctx.createGain();
        this.gainNode.gain.value = 0;
        this.gainNode.connect(outputNode);
        this.lowpassNode = Howler.ctx.createBiquadFilter();
        this.lowpassNode.type = "lowpass";
        this.lowpassNode.frequency.value = lowpassFreq;
        this.lowpassNode.Q.value = 0.707;
        this.lowpassNode.connect(this.gainNode);

        this.placeInfo = JSON.parse(localStorage.getItem('places'))[placeName]; //TODO change this to context manager once
        if(this.placeInfo==null){
            this.placeInfo = JSON.parse(localStorage.getItem('weathers'))[placeName];
        }

        this.soundTracks = {};
        this.setupSoundTracks();
    }

    setupSoundTracks(){
        let soundTracksInfo = this.placeInfo['sounds_list'];
        for(let soundTrackInfo of soundTracksInfo){
            this.soundTracks[soundTrackInfo.name] = new SoundTrack( soundTrackInfo.name,
                                                                    soundTrackInfo.average_time,
                                                                    soundTrackInfo.volume,
                                                                    this.lowpassNode);
        }
    }

    start(){
        for(let [soundName, soundTrack] of Object.entries(this.soundTracks)){
            soundTrack.start();
        }
    }

    cleanUp(time){
        setTimeout(()=>{
            for(let [soundName, soundTrack] of Object.entries(this.soundTracks)){
                soundTrack.destruct();
            }
            this.lowpassNode.disconnect();
            this.gainNode.disconnect();
        }, time);
        this.transitionVolume(0, time);
    }

    transitionVolume(newVolume, time){
        this.gainNode.gain.setTargetAtTime(newVolume, Howler.ctx.currentTime, time);
    }

    transitionLowpass(newFreq, time){
        this.lowpassNode.frequency.setTargetAtTime(newFreq, Howler.ctx.currentTime, time);
    }
}