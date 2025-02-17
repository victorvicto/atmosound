import React from 'react';

const BiomeSelector = () => {
    const { biomes } = useDataTree();
    const { currentBiome, updateCurrentBiome } = useStateContext();

    let biomeOptions = [];
    for(let biomeName in biomes){
        biomeOptions.push(<option key={biomeName+"-option"} value={biomeName}>{biomeName}</option>);
    }

    return (
        <div className='d-flex align-items-center gap-2 p-2'>
            <div>Biome: </div>
            <select 
                className="form-select form-select-sm text-capitalize"
                style={{ cursor: "pointer" }}
                value={currentBiome}
                onChange={(e)=>{updateCurrentBiome(e.target.value)}}
            >
                {biomeOptions}
            </select>
        </div>
    );
};

export default BiomeSelector;