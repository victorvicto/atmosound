import React from 'react';

const SaveAndImport = () => {
    const [needUpload, setNeedUpload] = useState(false);

    function downloadSetup(){
        let setup = {
            "places": places,
            "sounds": sounds,
            "biomes": biomes,
            "weathers": weathers,
            "moods": moods,
            "free_sound_api_key": localStorage.getItem("freesound_api_key") || ""
        };
        let data_string = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(setup));
        var downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", data_string);
        downloadLink.setAttribute("download", "my_atmousound_setup.json");
        downloadLink.click();
        downloadLink.remove();
    }

    function bakeInSetup(setup_content){
        set_places(setup_content.places);
        set_sounds(setup_content.sounds);
        set_biomes(setup_content.biomes);
        set_weathers(setup_content.weathers);
        set_moods(setup_content.moods);
        localStorage.setItem("freesound_api_key", setup_content.free_sound_api_key);
        localStorage.setItem("places", JSON.stringify(setup_content.places));
        localStorage.setItem("sounds", JSON.stringify(setup_content.sounds));
        localStorage.setItem("biomes", JSON.stringify(setup_content.biomes));
        localStorage.setItem("weathers", JSON.stringify(setup_content.weathers));
        localStorage.setItem("moods", JSON.stringify(setup_content.moods))
        set_places_status(initialisePlacesStatus());
    }

    function resetSetup(){
        if(!confirm("This will reset your setup to the default one. Are you sure?")) return;
        localStorage.clear();
        bakeInSetup(default_setup);
    }

    // TODO: remove reset at the end, it is just used for development
    return (
        <>
            <div className='d-flex gap-2'>
                <button type="button" className="btn btn-outline-danger" onClick={resetSetup}>Reset setup</button>
                <button type="button" className="btn btn-outline-success" onClick={()=>{setNeedUpload(true)}}>Upload setup</button>
                <button type="button" className="btn btn-outline-success" onClick={downloadSetup}>Save my setup</button>
            </div>
            <div className={"modal fade"+(need_upload?" show":"")} style={{display:(need_upload?"block":"none")}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Upload Settings</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={()=>{set_need_upload(false)}}></button>
                        </div>
                        <div className="modal-body">
                            <input type='file' accept='.json' onChange={(e) => { 
                                let file = e.target.files[0]; 
                                let reader = new FileReader();
                                reader.readAsText(file,'UTF-8');
                                reader.onload = readerEvent => {
                                    let content = JSON.parse(readerEvent.target.result);
                                    bakeInSetup(content);
                                }
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SaveAndImport;