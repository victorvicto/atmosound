import EditableText from "./EditableText";

function BiomeCard({biome_name}){
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">
                    <EditableText   base_text={biome_name}
                                    edit_prompt={"New biome name"}
                                    applyChange={()=>console.log("TODO: changeBiome function")}/>
                </h5>
            </div>
        </div>
    )
}
export default BiomeCard;