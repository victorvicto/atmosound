let default_setup = {
    "biomes":{
        "Main":{
            "weather probability":{
                ...
            }
        },
        "Seaside",
        "Desert"
    },
    "weathers":{
        "rain":{
            "outdoors":[]
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
        "village":{
            "sounds": [
                {
                    "sound name": "bell",
                    "repeating": 10, // average time passing before next trigger, 0 will trigger instantly
                    "volume": 1.0
                }
            ],
            "outdoors": true,
            "isolation": 0.5, // all indoors places have an accoustic isolation. The ones that have an isolation below 1 will hear the muffled weather sounds and will have the option of being right by it outside.
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

function load_setup(){

}