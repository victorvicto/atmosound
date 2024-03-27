import EditableText from "./EditableText";

function BiomeCard({biome_name, changeBiomeName, deleteBiome}){
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title text-capitalize">
                    <EditableText   base_text={biome_name}
                                    edit_prompt={"New biome name"}
                                    applyChange={(new_biome_name)=>changeBiomeName(biome_name, new_biome_name)}/>
                </h5>
                <button type="button" className="btn btn-outline-danger" onClick={()=>{
                    if(confirm("Are you sure you want to delete the biome: "+biome_name+"?")){
                        deleteBiome(biome_name);
                    }}}>
                        Delete biome <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    )
}
export default BiomeCard;