import { useState } from 'react'
import PlaceSTM from './PlaceSTM';
import { useStateContext } from '../StateContext';

function PlaceBadge({placeName, open_place_editor}){
    const { activePlace, adjacentPlaces, updateActivePlace, updateAdjacentVolume, updateAdjacentMuffleAmount, addAdjacentPlace, shutPlace } = useStateContext();

    let scheme = "secondary";
    let placeSTM = "";
    let footer = "";

    if(activePlace == placeName){
        scheme = "danger";
        placeSTM = <PlaceSTM placeName={placeName} volume={1} muffleAmount={0} />;
    } else if(placeName in Object.keys(adjacentPlaces)){
        scheme = "success";
        placeSTM = <PlaceSTM placeName={placeName} volume={adjacentPlaces[placeName].volume} muffleAmount={adjacentPlaces[placeName].muffle_amount} />;
        footer = (
        <div className='card-footer text-bg-success d-flex flex-column gap-2'>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-low"></i>
                <input type="range" value={adjacentPlaces[placeName].volume}
                        onChange={(e)=>updateAdjacentVolume(placeName, e.target.value)}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high"></i>
            </div>
            <div className='d-flex flex-row align-items-center gap-2'>
                <i className="fa-solid fa-volume-high"></i>
                <input type="range" value={adjacentPlaces[placeName].muffle_amount}
                        onChange={(e)=>updateAdjacentMuffleAmount(placeName, e.target.value)}
                        className="form-range"
                        min="0" max="1" step='.05'/>
                <i className="fa-solid fa-volume-high opacity-25"></i>
            </div>
        </div>);
    }

    return (
        <div className={'card border-'+scheme+(scheme=="secondary"?' shadow-sm':' border-3 shadow')}>
            <div className='card-body d-flex flex-row gap-2 align-items-center'>
                <h5 className={"card-title mb-0 text-capitalize text-"+scheme}>
                    <a onClick={open_place_editor} href="#" className='text-reset'>{placeName}</a>
                </h5>
                <div className='btn-group' role='group'>
                    <button onClick={()=>{updateActivePlace(placeName)}}
                        className={'btn btn'+(activePlace==placeName?'':'-outline')+'-danger btn-sm border-2'}>
                        <i className="fa-solid fa-bolt"></i>
                    </button>
                    <button onClick={()=>{updateActivePlace(placeName)}}
                        className={'btn btn'+(activePlace==placeName?'':'-outline')+'-danger btn-sm border-2'}>
                        🐌
                    </button>
                </div>
                <button onClick={()=>{
                    if(scheme == "success"){
                        shutPlace(placeName);
                    }else{
                        addAdjacentPlace(placeName);
                    }
                }}
                    className={'btn btn'+(placeName in Object.keys(adjacentPlaces)?'':'-outline')+'-success btn-sm'}>
                    <i className="fa-solid fa-volume-low"></i>
                </button>
            </div>
            {footer}
            {placeSTM}
        </div>
    )
}

export default PlaceBadge;