let default_setup = {
    "biomes":{
        "Main":{
            "weather probability":{
                "rain": 0.3
            }
        },
        "Seaside":{
            "weather probability":{
                "rain": 0.5
            }
        },
        "Desert":{
            "weather probability":{
                "rain": 0.05
            }
        }
    },
    "weathers":{
        "rain":{
            "sounds": [
                {
                    "sound name": "bell",
                    "repeating": 10, // average time passing before next trigger, 0 will trigger instantly
                    "volume": 1.0
                }
            ]
        }
           
    },
    "places":{
        "indoor":{
            "shop":{
                "sounds": [
                    {
                        "sound name": "bell",
                        "repeating": 10, // average time passing before next trigger, 0 will trigger instantly
                        "volume": 1.0
                    }
                ],
                "isolation": 0.5, // all indoors places have an accoustic isolation. The ones that have an isolation below 1 will hear the muffled weather sounds and will have the option of being right by it outside.
            }
        },
        "outdoor":{

        }
    },
    "sounds":{
        "bell":{
            "default ensemble":{
                "links":["https://cdn.freesound.org/previews/339/339812_5121236-lq.mp3"],
                "biomes":["Main","Seaside","Desert"] // This is a list of the relevent biomes for non-default ensembles
            }
        }
    }
}

let setup = null; // localStorage.getItem("local_setup"); // this is for the final setup
if(setup == null){
    setup = default_setup;
    localStorage.setItem("local_setup", JSON.stringify(setup));
} else {
    setup = JSON.parse(setup);
}

function load_setup(){
    build_main_page();
    build_sounds_lib_page();
}

function build_main_page(){
    const main_page_template_builder = Handlebars.compile(main_page_template);
    const main_page_html = main_page_template_builder(setup);
    document.getElementById("main-page").innerHTML = main_page_html;
}

function build_sounds_lib_page(){

}

load_setup();