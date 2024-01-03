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