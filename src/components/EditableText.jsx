import { PromptEdit } from "../UtilityFunctions";

function EditableText({base_text, edit_prompt, applyChange, isAllowed=(answer)=>true}){
    return (
        <>
        <div className="d-inline-flex gap-2">
            <a href='#' className='icon-link text-decoration-none ms-2' onClick={()=>{
                PromptEdit(edit_prompt, applyChange, isAllowed)
            }}>
                <i className="fa-solid fa-square-pen"></i>
            </a>
            <div className="text-nowrap">{base_text}</div>
        </div>
        </>
    )
}

export default EditableText;