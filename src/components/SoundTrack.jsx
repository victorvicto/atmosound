import React, { useEffect, useRef, useState } from 'react';
import SoundPlayer from './SoundPlayer';
import { useDataTree } from '../DataTreeContext';
import { useStateContext } from '../StateContext';

const SoundTrack = ({ soundName, averageDelay, volume, outputNode }) => {
    const { sounds } = useDataTree();
    const { currentBiome } = useStateContext();
    let soundInfo = null;
    let fileInfos = [];
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

    function pickFileInfo(prevUrl){
        let randIndex = Math.floor(Math.random()*fileInfos.length);
        let fileInfo = fileInfos[randIndex];
        if(fileInfos.length>1 && fileInfo.url==prevUrl){
            fileInfo = fileInfos[(randIndex+1) % fileInfos.length];
        }
        return fileInfo;
    }

    const url = pickFileInfo(null).url;

    return (
        <div className='card'>
            <div className='card-body'>
                <h2>{soundName}</h2>
                <SoundPlayer url={url} volume={volume} outputNode={outputNode} />
            </div>
        </div>
    );
};

export default SoundTrack;