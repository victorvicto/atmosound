import React, { useEffect, useRef, useState } from 'react';
import { Howler, Howl } from 'howler';
import SoundTrack from './SoundTrack';
import { useDataTree } from '../DataTreeContext.jsx';
import { useStateContext } from '../StateContext.jsx';

const PlaceSTM = ({ placeName, volume, muffleAmount, outputNode }) => {
    const { places, sounds } = useDataTree();
    const { currentBiome } = useStateContext();
    const gainNode = useRef(Howler.ctx.createGain());
    gainNode.current.gain.value = 0;
    gainNode.current.connect(outputNode);

    useEffect(() => {
        gainNode.current.gain.setTargetAtTime(volume, Howler.ctx.currentTime, 2);
        console.log("starting transition of "+placeName+" to volume "+volume);
        setTimeout(() => {
            console.log("finished transition of "+placeName+" to volume "+volume);
        }, 2000);
    }, [volume]);

    const placeInfo = places[placeName];
    let soundTracks = [];
    for(let soundInfo of placeInfo.sounds_list){
        soundTracks.push(<SoundTrack soundName={soundInfo.name}
                                    averageDelay={soundInfo.average_time}
                                    volume={soundInfo.volume}
                                    outputNode={gainNode} />);
    }

    return (
        <div className='card'>
            <div className='card-body'>
                <h2>{placeName}</h2>
                {soundTracks}
            </div>
        </div>
    );
    
};

export default PlaceSTM;