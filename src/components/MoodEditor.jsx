import EditableText from "./EditableText";

function MoodEditor({edited_mood_name, sound_name, changeMoodName, changeMoodSound, deleteMood, closeEditor}){
    return (
        <div className="offcanvas offcanvas-end show"
            tabIndex="-1">
            <div className="offcanvas-header">
                <h3 className="offcanvas-title text-capitalize">
                    <EditableText 
                        base_text={edited_mood_name}
                        edit_prompt={"New mood name"}
                        applyChange={(new_mood_name)=>{
                            changeMoodName(edited_mood_name, new_mood_name);
                        }}/>
                </h3>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeEditor}></button>
            </div>
            <div className="offcanvas-body">
                <div className="mb-3">
                    <label className="form-label me-2">Sound:</label>
                    <EditableText 
                            base_text={sound_name==null?"no sound yet":sound_name}
                            edit_prompt={"New sound name"}
                            applyChange={(new_sound_name)=>{
                                changeMoodSound(edited_mood_name, new_sound_name);
                            }}/>
                </div>
                <button type="button" className="btn btn-outline-danger" onClick={()=>{
                        if(confirm("Are you sure you want to delete the mood called: "+edited_mood_name)){
                            closeEditor();
                            deleteMood(edited_mood_name);
                        }}}>Delete mood <i className="fa-solid fa-trash"></i></button>
            </div>
        </div>
    );
}

export default MoodEditor;