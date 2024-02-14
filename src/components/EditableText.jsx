import EditLink from "./EditLink";

function EditableText({base_text, edit_prompt, isAllowed=(answer)=>true, applyChange}){
    return (
        <>
        {base_text}
        <EditLink edit_prompt={edit_prompt} isAllowed={isAllowed} applyChange={applyChange}/>
        </>
    )
}

export default EditableText;