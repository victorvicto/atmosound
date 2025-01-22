import SoundPlayer from './SoundPlayer.js';

class SoundTrack {
    constructor(soundName, averageDelay, volume, outputNode){
        this.averageDelay = averageDelay;
        this.gainNode = Howler.ctx.createGain();
        gainNode.gain.value = volume;
        this.gainNode.connect(outputNode);
        this.currentlyPlaying = null;
        this.nextMission = null;
        this.soundInfo = JSON.parse(localStorage.getItem('sounds'))[soundName]; //TODO change this to context manager once ready
        this.fileInfos = this.getFileInfos();
    }

    getFileInfos(){
        let fileInfos = [];
        for(let sound_pack_name in this.soundInfo.sound_packs){
            if(soundInfo.sound_packs[sound_pack_name].biome_presences[localStorage.getItem("active_biome")]){
                for(let sound_file of soundInfo.sound_packs[sound_pack_name].sound_files){
                    fileInfos.push({url:sound_file.url, volume_mul:sound_file.volume_mul});
                }
            }
        }
        return fileInfos;
    }

    start(){
        let firstDelay = Math.random()*this.averageDelay*1000/2;
        this.nextMission = setTimeout(()=>{
            doMission(null);
        }, firstDelay);
    }

    doMission(prevUrl){
        let fileInfo = this.pickFileInfo(prevUrl);
        this.currentlyPlaying = new SoundPlayer(fileInfo.url, fileInfo.volume, this.gainNode);
        this.currentlyPlaying.play();
        let nextDelay = 1000 * (this.currentlyPlaying.howl.duration() + (Math.random()+0.5) * this.averageDelay);
        this.nextMission = setTimeout(()=>{
            this.doMission(fileInfo.url);
        }, nextDelay);
    }

    pickFileInfo(prevUrl){
        let randIndex = Math.floor(Math.random()*this.fileInfos.length);
        let fileInfo = this.fileInfos[randIndex];
        if(this.fileInfos.length>1 && fileInfo.url==prevUrl){
            fileInfo = this.fileInfos[(randIndex+1) % this.fileInfos.length];
        }
        return fileInfo;
    }

    destruct(){
        clearTimeout(this.nextMission);
        this.currentlyPlaying.destruct();
        this.gainNode.disconnect();
    }
}