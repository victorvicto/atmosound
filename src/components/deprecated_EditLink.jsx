function EditLink({edit_prompt, isAllowed=(answer)=>true, applyChange}){
    return (
        <a href='#' className='icon-link text-decoration-none ms-2' onClick={()=>{
            while(true){
                let new_name = prompt(edit_prompt);
                if(new_name!=null && isAllowed(new_name)){
                    if(applyChange(new_name)){
                        break;
                    }
                }
            }
        }}>
            <i className="fa-solid fa-square-pen"></i>
        </a>
    )
}

export default EditLink;