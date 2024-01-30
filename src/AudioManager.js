import {Howl, Howler} from 'howler';

export function startAudioContext(){
    Howler.volume(1);
    console.log("starting audio context");
    let first_sound = new Howl({
        src: ['https://cdn.freesound.org/data/previews/80/80921_1022651-lq.mp3'],
        autoplay: false
    });
    first_sound.on('end', function(){
        first_sound.unload();
    });
    first_sound.play();
}

export function playTest(){
    let first_sound = new Howl({
        src: ['https://cdn.freesound.org/data/previews/80/80921_1022651-lq.mp3'],
        autoplay: false
    });
    first_sound.on('end', function(){
        first_sound.unload();
    });
    first_sound.play();
}

let currently_playing_places = {};
let fading_out_places = {}; // each place has .howls and .filter

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

function createAudioSource(url, output_node){
    // TODO create either Howl or mediastreamaudiosource from url and plug it into output_node
    // let new_howl = new Howl({
    //     src: [random_url],
    //     autoplay: false,
    //     volume: sound_descr.volume
    // });
    // currently_playing_places[place_name].howls.push(new_howl);
    // let time = (Math.random()/2)*sound_descr.average_time*1000;
    // new_howl.on('load', ()=>{
    //     let howl_duration = new_howl.duration();
    //     if(howl_duration>20){
    //         new_howl.seek(Math.random()*howl_duration);
    //     }
    //     setTimeout(()=>{
    //         new_howl._sounds[0]._node.disconnect();
    //         new_howl._sounds[0]._node.connect(new_filter_node, 0, i);
    //         new_howl.play();
    //     }, time);
    // });
    // new_howl.on('end', ()=>{
    //     let time = (Math.random()+0.5)*sound_descr.average_time*1000;
    //     setTimeout(()=>{
    //         new_howl.play();
    //     }, time);
    // })
}

async function translateUrl(url){
    let final_url = url;
    if(url.includes("::")){
        final_url = null;
        let [prefix, sound_id] = url.split("::");
        if(prefix=="fs"){
            let key = localStorage.getItem("freesound_api_key");
            if(key!=null && key!=""){
                const resp = await fetch("https://freesound.org/apiv2/sounds/"+sound_id+"/?fields=previews&token="+key);
                const previews = await resp.json();
                console.log(previews);
                if("previews" in previews){
                    final_url = previews.previews["preview-hq-mp3"];
                }
            }
        } else if(prefix=="yt") {
            const resp = await fetch("https://yt-source.nico.dev/"+sound_id);
            const info = await resp.json();
            console.log(info);
            if("formats" in info){
                if("audio/webm" in info["formats"])
                    final_url = info["formats"]["audio/webm"];
                else if("audio/mp4" in info["formats"])
                    final_url = info["formats"]["audio/mp4"];
            }
        }
    }
    console.log(final_url);
    return final_url;
}

// TODO, log to see why youtube makes no sound
export async function start_place(place_name, sounds_list, muffled_amount, place_volume, getSoundUrls){
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
        media_stream_audio_sources: [],
        filter_node: new_filter_node,
        gain_node: new_gain_node
    }
    let i = 0;
    for(let sound_descr of sounds_list){
        if(!sound_should_be_played(sound_descr)) continue;
        let sound_urls = await getSoundUrls(sound_descr.name);
        if(sound_urls.length==0) continue;
        let random_url = sound_urls[Math.floor(Math.random()*sound_urls.length)];
        createAudioSource(random_url, new_filter_node);       
    }
}