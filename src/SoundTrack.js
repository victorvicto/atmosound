class SoundTrack {
    constructor(soundInfo, volume, outputNode){
        this.gainNode = Howler.ctx.createGain();
        gainNode.gain.value = volume;
        this.gainNode.connect(outputNode);

        this.soundInfo = soundInfo;
        this.currentlyPlaying = null;
        this.nextMission = null;
    }

    pickSound(){
        
    }
}