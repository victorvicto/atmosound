function load_page(page_name){
    let pages = document.getElementsByClassName("page");
    for(page of pages){
        if(page.id==page_name){
            page.hidden = false;
        } else {
            page.hidden = true;
        }
    }
}