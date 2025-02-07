import React, { useEffect, useRef, useState } from 'react';
import SoundPlayer from './SoundPlayer';
import { useDataTree } from '../dataTreeContext';
import { useStateContext } from '../stateContext';

const SoundTrack = ({ soundName, averageDelay, volume, outputNode }) => {
    const { sounds } = useDataTree();
    const { currentBiome } = useStateContext();
    const soundInfo = null;
    const fileInfos = [];
    if (soundName != null) {
        soundInfo = sounds[soundName];
        for(let soundPackName in soundInfo.sound_packs){
            if(soundInfo.sound_packs[soundPackName].biome_presences[currentBiome]){
                for(let soundFile of soundInfo.sound_packs[soundPackName].sound_files){
                    fileInfos.push({url:soundFile.url, volume_mul:soundFile.volume_mul});
                }
            }
        }
    }
    const url = pickFileInfo(null).url;

    function pickFileInfo(prevUrl){
        let randIndex = Math.floor(Math.random()*this.fileInfos.length);
        let fileInfo = this.fileInfos[randIndex];
        if(this.fileInfos.length>1 && fileInfo.url==prevUrl){
            fileInfo = this.fileInfos[(randIndex+1) % this.fileInfos.length];
        }
        return fileInfo;
    }


    return (
        <div className='card'>
            <div className='card-body'>
                <h2>{soundName}</h2>
                <SoundPlayer url={url} volume={volume} outputNode={outputNode} />
            </div>
        </div>
    );
};

export default SoundTrackComponent;