import {Howl, Howler} from 'howler';

export function startAudioContext(){
    Howler.volume(1);
    console.log("starting audio context");
    let first_sound = new Howl({
        src: ["https://v1.cdnpk.net/videvo_files/audio/premium/audio0130/watermarked/MagicCartoon%20CTE01_92.5_preview.mp3", 'https://actions.google.com/sounds/v1/cartoon/pop.ogg'],
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
let fading_out_places = {}; // each place has .howls , .filter and .critical_timeouts
let mood = {
    mood_name: null,
    howl: null,
    root_url: null,
    root_volume_mul: 1
};
let last_mood_howl = null;

// TODO change the parameters of the newly changed functions to include volume multiplyer
export async function switch_mood_sound(mood_name, sound_urls, volume, previous_url=null, force_change=false){
    if(volume==null){
        if(mood.howl!=null){
            volume = mood.howl.volume()/mood.root_volume_mul; // Removing the previous volume_mul that had been baked in
        }else{
            volume = 1;
        }
    }
    if(mood.howl!=null){
        let url_is_in = false;
        for(let url_info of sound_urls){
            if(url_info.url==mood.root_url){
                url_is_in = true;
                break;
            }
        }
        if(mood.mood_name == mood_name && url_is_in && !force_change){
            mood.howl.volume(volume * mood.root_volume_mul);
            return;
        }
        last_mood_howl = mood.howl;
        last_mood_howl.fade(last_mood_howl.volume(), 0, localStorage.getItem("short_transition_time"));
        setTimeout(()=>last_mood_howl.unload(), localStorage.getItem("short_transition_time"));
    }
    if(sound_urls.length>0){
        let random_index = Math.floor(Math.random()*sound_urls.length);
        let random_url_info = sound_urls[random_index];
        if(random_url_info.url == previous_url && sound_urls.length>1){
            random_url_info = sound_urls[(random_index+1)%sound_urls.length];
        }
        mood.root_url = random_url_info.url;
        mood.root_volume_mul = random_url_info.volume_mul;
        mood.howl = new Howl({
            src: [await finaliseUrl(random_url_info.url)],
            autoplay: true,
            volume: volume * random_url_info.volume_mul,
            html5: false // allows volume to be higher than 1, but could cause problems
        });
        mood.howl.on('end', function(){
            switch_mood_sound(mood_name, sound_urls, null, random_url_info.url, true)
        });
    }else{
        mood.howl = null;
        mood.root_url = null;
    }
    console.log(mood_name)
    mood.mood_name = mood_name;
}

export function clear_fading_out_places(){
    for(const[place_name, place_info] of Object.entries(fading_out_places)){
        for(let howl of Object.values(place_info.howls)){
            howl.unload();
        }
        for(let timeout_id of place_info.critical_timeouts){
            clearTimeout(timeout_id);
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

// TODO: what happens if the transition time is longer than the current howl? Will the next howl be unloaded?
export function fade_out_place(place_name, slow_transition){
    if(!(place_name in currently_playing_places)) return;

    let transition_time = slow_transition?localStorage.getItem("slow_transition_time"):localStorage.getItem("short_transition_time");

    fading_out_places[place_name] = currently_playing_places[place_name];
    delete currently_playing_places[place_name];
    for(let timeout_id of fading_out_places[place_name].critical_timeouts){
        clearTimeout(timeout_id);
    }
    for(let howl of Object.values(fading_out_places[place_name].howls)){
        howl.fade(howl.volume(), 0, transition_time);
        setTimeout(()=>howl.unload(),  transition_time);
    }
    setTimeout(()=>{
        fading_out_places[place_name].gain_node.disconnect();
        delete fading_out_places[place_name];
    }, transition_time);
}

function sound_should_be_played(sound_descr){
    if(!sound_descr["time_of_day"][localStorage.getItem("time_of_day")]) return false;
    if(sound_descr["weathers"]!=null){
        if(!sound_descr["weathers"][localStorage.getItem("current_weather")]) return false;
    }
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

// function createHowl(urls, sound_descr, previous_url=null){
//     let url = urls[Math.floor(Math.random()*urls.length)];
//     let new_howl = new Howl({
//         src: [url],
//         autoplay: false,
//         volume: sound_descr.volume
//     });
//     let time = (Math.random()/2)*sound_descr.average_time*1000;
//     new_howl.on('load', ()=>{
//         let howl_duration = new_howl.duration();
//         if(howl_duration>20){
//             new_howl.seek(Math.random()*howl_duration);
//         }
//         setTimeout(()=>{
//             new_howl._sounds[0]._node.disconnect();
//             // TODO, not sure it works without the i as input index, does it override the 0 index input or does it combine all inputs?
//             //new_howl._sounds[0]._node.connect(playing_place.filter_node, 0, i);
//             new_howl._sounds[0]._node.connect(playing_place.filter_node);
//             new_howl.play();
//         }, time);
//     });
//     new_howl.on('end', ()=>{
//         let time = (Math.random()+0.5)*sound_descr.average_time*1000;
//         setTimeout(()=>{
//             new_howl.play();
//         }, time);
//     })
// }

async function finaliseUrl(url){
    if(url.includes("::")){
        let [prefix, sound_id] = url.split("::");
        if(prefix=="fs"){
            let key = localStorage.getItem("freesound_api_key");
            if(key!=null && key!=""){
                const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
                const previews = await resp.json();
                console.log(previews);
                if("previews" in previews){
                    return previews.previews["preview-hq-mp3"];
                }
            }
        }
        // I have my own personal ytdl backend
        // not sure how to make this functionality public without backend
        // maybe I upload backend and only give access to api codes
        // I give an api code to patreons
        else if(prefix=="yt"){
            return "http://localhost:5000/yt/"+sound_id;
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
    }
    
    return url;
}

function setupHowl(howl, time_before_start, sound_descr, url_info, urls, playing_place, fade_in){
    let howl_duration = howl.duration()*1000;// in ms
    let random_forward = 0;
    if(howl_duration>20000){
        random_forward = Math.random()*howl_duration/4;
        howl.seek(random_forward/1000); // we divide by four to make sure it is still in first quarter (/1000 -> in seconds)
    }
    let time_before_end = howl_duration-random_forward;
    let time_before_new_sound = time_before_end;
    if(sound_descr.average_time>0){
        time_before_new_sound += (Math.random()+0.5)*sound_descr.average_time*1000;
    } else {
        time_before_new_sound += sound_descr.average_time*1000;
        if(time_before_new_sound<howl_duration/2){
            time_before_new_sound = howl_duration/2;
        }
    }
    setTimeout(()=>{
        howl._sounds[0]._node.disconnect();
        // TODO, not sure it works without the i as input index, does it override the 0 index input or does it combine all inputs?
        //new_howl._sounds[0]._node.connect(playing_place.filter_node, 0, i);
        howl._sounds[0]._node.connect(playing_place.filter_node);
        howl.play();
        howl.fade(0, sound_descr.volume * url_info.volume_mul, fade_in)
    }, time_before_start);
    let critical_timeout_id = setTimeout(()=>{
        if(time_before_new_sound<time_before_end){
            howl.fade(howl.volume(), 0, time_before_end-time_before_new_sound)
        }
        createAndAddHowl(urls, playing_place, sound_descr, url_info.url, time_before_end-time_before_new_sound);
    }, time_before_new_sound);
    playing_place.critical_timeouts.push(critical_timeout_id);
    setTimeout(()=>{
        console.log("unloading after "+time_before_end+" ms")
        howl.unload();
    }, time_before_end);
}

async function createAndAddHowl(urls, playing_place, sound_descr, previous_url=null, fade_in=0){
    let rand_i = Math.floor(Math.random()*urls.length);
    let url_info = urls[rand_i];
    if(urls.length>1 && url_info.url==previous_url){
        url_info = urls[(rand_i+1)%urls.length];
    }
    let url = await finaliseUrl(url_info.url);
    console.log(url);
    let new_howl = new Howl({
        src: [url],
        autoplay: false,
        volume: sound_descr.volume * url_info.volume_mul,
        html5: false // allows volume to be higher than 1, but could cause problems
    });
    console.log(new_howl.state())
    let time_before_start = 0;
    if(previous_url==null && sound_descr.average_time>0){
        time_before_start = (Math.random()/2)*sound_descr.average_time*1000;
    }
    if(new_howl.state()=="loaded"){
        setupHowl(new_howl, time_before_start, sound_descr, url_info, urls, playing_place, fade_in);
    } else {
        new_howl.on('load', ()=>{
            setupHowl(new_howl, time_before_start, sound_descr, url_info, urls, playing_place, fade_in);
        });
    }
    playing_place.howls[sound_descr.name] = new_howl;
}

// async function createAudioSource(url, playing_place, sound_descr){
//     // TODO create either Howl or mediastreamaudiosource from url and plug it into output_node
//     if(url.includes("::")){
//         let [prefix, sound_id] = url.split("::");
//         if(prefix=="fs"){
//             let key = localStorage.getItem("freesound_api_key");
//             if(key!=null && key!=""){
//                 const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
//                 const previews = await resp.json();
//                 console.log(previews);
//                 if("previews" in previews){
//                     let final_url = previews.previews["preview-hq-mp3"];
//                     createAndAddHowl(final_url, playing_place, sound_descr);
//                 }
//             }
//         }
//         // I have my own personal ytdl backend
//         // not sure how to make this functionality public without backend
//         // maybe I upload backend and only give access to api codes
//         // I give an api code to patreons
//         else if(prefix=="yt"){
//             createAndAddHowl("http://localhost:5000/yt/"+sound_id, playing_place, sound_descr);
//             // const resp = await fetch("https://yt-source.nico.dev/"+sound_id);
//             // const info = await resp.json();
//             // console.log(info);
//             // if("formats" in info){
//             //     if("audio/webm" in info["formats"]){
//             //         let final_url = info["formats"]["audio/webm"];
//             //         createAndAddStream(final_url, playing_place);
//             //     } else if("audio/mp4" in info["formats"]){
//             //         let final_url = info["formats"]["audio/mp4"];
//             //         createAndAddStream(final_url, playing_place);
//             //     }
//             // }
//         }
//     } else {
//         createAndAddHowl(url, playing_place, sound_descr);
//     }
// }

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
export async function start_place(place_name, sounds_list, muffled_amount, place_volume, getSoundUrls, slow_transition){
    if (sounds_list.length==0) return;

    let transition_time = slow_transition?localStorage.getItem("slow_transition_time"):localStorage.getItem("short_transition_time");

    if(place_name in currently_playing_places){
        console.log("already playing place", place_name);
        currently_playing_places[place_name].filter_node.frequency.setTargetAtTime(
            muffle_amount_to_frequency(muffled_amount), 
            Howler.ctx.currentTime, 
            transition_time/1000);
        currently_playing_places[place_name].gain_node.gain.setTargetAtTime(
            place_volume, 
            Howler.ctx.currentTime, 
            transition_time/1000);
        return;
    }
    console.log("starting place", place_name);
    let new_gain_node = Howler.ctx.createGain();
    new_gain_node.gain.value = place_volume;
    // new_gain_node.gain.value = 0;
    // console.log(localStorage.getItem("short_transition_time"));
    // new_gain_node.gain.setTargetAtTime(
    //     place_volume, 
    //     Howler.ctx.currentTime, 
    //     localStorage.getItem("short_transition_time")/1000);
    new_gain_node.connect(Howler.masterGain);

    let new_filter_node = Howler.ctx.createBiquadFilter();
    new_filter_node.channelCount = sounds_list.length;
    console.log("channel count", new_filter_node.channelCount);
    new_filter_node.type = "lowpass";
    new_filter_node.frequency.value = muffle_amount_to_frequency(muffled_amount);
    new_filter_node.Q.value = 0.707;
    new_filter_node.connect(new_gain_node);

    currently_playing_places[place_name] = {
        howls: {},
        //media_stream_audio_sources: [],
        //audio_elements: [],
        filter_node: new_filter_node,
        gain_node: new_gain_node,
        critical_timeouts: []
    }
    let i = 0;
    for(let sound_descr of sounds_list){
        if(!sound_should_be_played(sound_descr)) continue;
        let sound_urls = getSoundUrls(sound_descr.name);
        if(sound_urls.length==0) continue;
        createAndAddHowl(sound_urls, currently_playing_places[place_name], sound_descr, null, transition_time);       
    }
}