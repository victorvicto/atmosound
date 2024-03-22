import {Howl, Howler} from 'howler';

export function startAudioContext(){
    Howler.volume(1);
    console.log("starting audio context");
    let first_sound = new Howl({
        src: ['https://actions.google.com/sounds/v1/cartoon/pop.ogg'],
        autoplay: false
    });
    first_sound.on('end', function(){
        first_sound.unload();
    });
    first_sound.play();
}

export function playTest(){
    let first_sound = new Howl({
        src: ['http://localhost:5000/yt/rYgprgGEwyA'],
        format: ['webm'],
        autoplay: false
    });
    first_sound.on('end', function(){
        first_sound.unload();
    });
    first_sound.play();

    // let new_audio_element = document.createElement("audio");
    // new_audio_element.src = 'https://universal-soundbank.com/sounds/13699.mp3';
    // new_audio_element.autoplay = true;
    // //new_audio_element.hidden = true;
    // document.body.appendChild(new_audio_element);
    // let media_stream_audio_source = Howler.ctx.createMediaElementSource(new_audio_element);
    // media_stream_audio_source.connect(Howler.masterGain);

    // const reader = new FileReader();
    // reader.onload = function fileReadCompleted() {
    //     // when the reader is done, the content is in reader.result.
    //     console.log("the url is: "+reader.result);
    //     let first_sound = new Howl({
    //         src: [reader.result],
    //         autoplay: false
    //     });
    //     first_sound.on('end', function(){
    //         first_sound.unload();
    //     });
    //     first_sound.play();
    // };
    // reader.readAsDataURL(document.getElementById("fileInput").files[0]);
}

let currently_playing_places = {};
let fading_out_places = {}; // each place has .howls and .filter
let mood = {
    mood_name: null,
    howl: null
};
let last_mood_howl = null;

export function switch_mood_sound(mood_name, sound_urls, volume){
    if(mood.mood_name == mood_name){
        if(mood.howl!=null)
            mood.howl.volume(volume);
        return;
    }
    if(mood.howl!=null){
        last_mood_howl = mood.howl;
        last_mood_howl.fade(last_mood_howl.volume(), 0, localStorage.getItem("transition_time"));
        setTimeout(()=>last_mood_howl.unload(), localStorage.getItem("transition_time"));
    }
    if(sound_urls.length>0){
        let random_url = sound_urls[Math.floor(Math.random()*sound_urls.length)];
        mood.howl = new Howl({
            src: [random_url],
            autoplay: true,
            volume: volume
        });
        mood.howl.on('end', function(){
            mood.howl.play();
        });
    }else{
        mood.howl = null;
    }
    mood.mood_name = mood_name;
}

export function clear_fading_out_places(){
    for(const[place_name, place_info] of Object.entries(fading_out_places)){
        for(let howl of place_info.howls){
            howl.unload();
        }
        place_info.gain_node.disconnect();
    }
    fading_out_places = {};
}

const max_freq = 8000;
function muffle_amount_to_frequency(muffle_amount){
    // return max_freq*(1-muffle_amount);
    return max_freq*((1-muffle_amount)**3);
}

export function fade_out_place(place_name){
    if(!(place_name in currently_playing_places)) return;

    fading_out_places[place_name] = currently_playing_places[place_name];
    delete currently_playing_places[place_name];
    for(let howl of fading_out_places[place_name].howls){
        howl.fade(howl.volume(), 0, localStorage.getItem("transition_time"));
        setTimeout(()=>howl.unload(), localStorage.getItem("transition_time"));
    }
    setTimeout(()=>{
        fading_out_places[place_name].gain_node.disconnect();
        delete fading_out_places[place_name];
    }, localStorage.getItem("transition_time"));
}

function sound_should_be_played(sound_descr){
    if(!sound_descr["time_of_day"][localStorage.getItem("time_of_day")]) return false;
    if(!sound_descr["weathers"][localStorage.getItem("current_weather")]) return false;
    return true;
}

// function createAndAddStream(mediastreamaudiosource_url, playing_place){
//     let new_audio_element = document.createElement("audio");
//     new_audio_element.src = mediastreamaudiosource_url;
//     new_audio_element.autoplay = true;
//     new_audio_element.hidden = true;
//     document.body.appendChild(new_audio_element);
//     let media_stream_audio_source = Howler.ctx.createMediaElementSource(new_audio_element);
//     media_stream_audio_source.connect(playing_place.filter_node);
//     playing_place.audio_elements.push(new_audio_element);
//     playing_place.media_stream_audio_sources.push(media_stream_audio_source);
// }

function createAndAddHowl(url, playing_place, sound_descr){
    let new_howl = new Howl({
        src: [url],
        autoplay: false,
        volume: sound_descr.volume
    });
    playing_place.howls.push(new_howl);
    let time = (Math.random()/2)*sound_descr.average_time*1000;
    new_howl.on('load', ()=>{
        let howl_duration = new_howl.duration();
        if(howl_duration>20){
            new_howl.seek(Math.random()*howl_duration);
        }
        setTimeout(()=>{
            new_howl._sounds[0]._node.disconnect();
            // TODO, not sure it works without the i as input index, does it override the 0 index input or does it combine all inputs?
            //new_howl._sounds[0]._node.connect(playing_place.filter_node, 0, i);
            new_howl._sounds[0]._node.connect(playing_place.filter_node);
            new_howl.play();
        }, time);
    });
    new_howl.on('end', ()=>{
        let time = (Math.random()+0.5)*sound_descr.average_time*1000;
        setTimeout(()=>{
            new_howl.play();
        }, time);
    })
}

async function createAudioSource(url, playing_place, sound_descr){
    // TODO create either Howl or mediastreamaudiosource from url and plug it into output_node
    if(url.includes("::")){
        let [prefix, sound_id] = url.split("::");
        if(prefix=="fs"){
            let key = localStorage.getItem("freesound_api_key");
            if(key!=null && key!=""){
                const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
                const previews = await resp.json();
                console.log(previews);
                if("previews" in previews){
                    let final_url = previews.previews["preview-hq-mp3"];
                    createAndAddHowl(final_url, playing_place, sound_descr);
                }
            }
        }
        // I have my own personal ytdl backend
        // not sure how to make this functionality public without backend
        // maybe I upload backend and only give access to api codes
        // I give an api code to patreons
        else if(prefix=="yt"){
            createAndAddHowl("http://localhost:5000/yt/"+sound_id, playing_place, sound_descr);
            // const resp = await fetch("https://yt-source.nico.dev/"+sound_id);
            // const info = await resp.json();
            // console.log(info);
            // if("formats" in info){
            //     if("audio/webm" in info["formats"]){
            //         let final_url = info["formats"]["audio/webm"];
            //         createAndAddStream(final_url, playing_place);
            //     } else if("audio/mp4" in info["formats"]){
            //         let final_url = info["formats"]["audio/mp4"];
            //         createAndAddStream(final_url, playing_place);
            //     }
            // }
        }
    } else {
        createAndAddHowl(url, playing_place, sound_descr);
    }
}

// async function translateUrl(url){
//     let final_url = url;
//     if(url.includes("::")){
//         final_url = null;
//         let [prefix, sound_id] = url.split("::");
//         if(prefix=="fs"){
//             let key = localStorage.getItem("freesound_api_key");
//             if(key!=null && key!=""){
//                 const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
//                 const previews = await resp.json();
//                 console.log(previews);
//                 if("previews" in previews){
//                     final_url = previews.previews["preview-hq-mp3"];
//                 }
//             }
//         } else if(prefix=="yt") {
//             const resp = await fetch("https://yt-source.nico.dev/"+sound_id);
//             const info = await resp.json();
//             console.log(info);
//             if("formats" in info){
//                 if("audio/webm" in info["formats"])
//                     final_url = info["formats"]["audio/webm"];
//                 else if("audio/mp4" in info["formats"])
//                     final_url = info["formats"]["audio/mp4"];
//             }
//         }
//     }
//     console.log(final_url);
//     return final_url;
// }

// TODO, log to see why youtube makes no sound
export async function start_place(place_name, sounds_list, muffled_amount, place_volume, getSoundUrls){
    if (sounds_list.length==0) return;
    if(place_name in currently_playing_places){
        console.log("already playing place", place_name);
        currently_playing_places[place_name].filter_node.frequency.setTargetAtTime(
            muffle_amount_to_frequency(muffled_amount), 
            Howler.ctx.currentTime, 
            localStorage.getItem("transition_time")/1000);
        currently_playing_places[place_name].gain_node.gain.setTargetAtTime(
            place_volume, 
            Howler.ctx.currentTime, 
            localStorage.getItem("transition_time")/1000);
        return;
    }
    console.log("starting place", place_name);
    let new_gain_node = Howler.ctx.createGain();
    new_gain_node.gain.value = 0;
    new_gain_node.gain.setTargetAtTime(
        place_volume, 
        Howler.ctx.currentTime, 
        localStorage.getItem("transition_time")/1000);
    new_gain_node.connect(Howler.masterGain);

    let new_filter_node = Howler.ctx.createBiquadFilter();
    new_filter_node.channelCount = sounds_list.length;
    console.log("channel count", new_filter_node.channelCount);
    new_filter_node.type = "lowpass";
    new_filter_node.frequency.value = muffle_amount_to_frequency(muffled_amount);
    new_filter_node.Q.value = 0.707;
    new_filter_node.connect(new_gain_node);

    currently_playing_places[place_name] = {
        howls: [],
        //media_stream_audio_sources: [],
        //audio_elements: [],
        filter_node: new_filter_node,
        gain_node: new_gain_node
    }
    let i = 0;
    for(let sound_descr of sounds_list){
        if(!sound_should_be_played(sound_descr)) continue;
        let sound_urls = getSoundUrls(sound_descr.name);
        if(sound_urls.length==0) continue;
        let random_url = sound_urls[Math.floor(Math.random()*sound_urls.length)];
        createAudioSource(random_url, currently_playing_places[place_name], sound_descr);       
    }
}