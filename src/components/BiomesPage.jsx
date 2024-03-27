import BiomeCard from "./BiomeCard";
import { PromptEdit } from "../UtilityFunctions";

function BiomesPage({biomes, addBiome, changeBiomeName, deleteBiome}){
    const biome_cards = Object.entries(biomes).map(([biome_name, biome_info]) => 
            <BiomeCard  biome_name={biome_name}
                        changeBiomeName={changeBiomeName}
                        deleteBiome={deleteBiome}
                        key={biome_name+"-biome-card"}/>
        );

    return (
        <>
        <div className='d-flex flex-column gap-3'>
            {biome_cards}
        </div>
        <div className='d-flex justify-content-center mt-3'>
            <button className="btn btn-outline-primary btn-lg" onClick={addBiome}>
                Add Biome
            </button>
        </div>
        </>
    )
}
export default BiomesPage;