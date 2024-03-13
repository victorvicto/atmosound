export function RecursiveReplace(object, keys_path, new_value){
    console.log(object);
    console.log(keys_path);
    if(!Array.isArray(keys_path)){
        object[keys_path] = new_value;
    } else {
        let current_obj = object;
        for(let i=0; i<keys_path.length-1; i++){
            current_obj = current_obj[keys_path[i]];
        }
        current_obj[keys_path[keys_path.length-1]] = new_value;
    }
}

export function PromptEdit(edit_prompt, applyChange, isAllowed=(answer)=>true){
    while(true){
        let new_name = prompt(edit_prompt);
        console.log(new_name);
        if(new_name == null) break;
        if(new_name.length==0){
            edit_prompt += " (Cannot be empty)";
            continue;
        }
        if(isAllowed(new_name)){
            // if(applyChange(new_name)){
            //     break;
            // }
            applyChange(new_name.toLowerCase());
            break;
        }
    }
}