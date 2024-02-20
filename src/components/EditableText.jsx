import { PromptEdit } from "../UtilityFunctions";

function EditableText({base_text, edit_prompt, applyChange, isAllowed=(answer)=>true}){
    return (
        <>
        {base_text}
        <a href='#' className='icon-link text-decoration-none ms-2' onClick={()=>{
            PromptEdit(edit_prompt, applyChange, isAllowed)
        }}>
            <i className="fa-solid fa-square-pen"></i>
        </a>
        </>
    )
}

export default EditableText;