import {Howl, Howler} from 'howler';

export function startAudioContext(){
    Howler.volume(1);
}

let currently_playing_places = {};
let fading_out_places = {}; // each place has .howls and .filter

function clear_fading_out_places(){
    for(const[place_name, place_howls] of Object.entries(fading_out_places)){
        for(let howl of place_howls){
            howl.unload();
        }
    }
    fading_out_places = {};
}

const max_freq = 8000;
function muffle_amount_to_frequency(muffle_amount){
    return max_freq*(1-muffle_amount);
}

export function fade_out_place(place_name){
    if(!(place_name in currently_playing_places)) return;

    fading_out_places[place_name] = currently_playing_places[place_name];
    delete currently_playing_places[place_name];
    for(let howl of fading_out_places[place_name].howls){
        howl.fade(howl.volume(), 0, localStorage.getItem("transition_time"));
        setTimeout(()=>howl.unload(), localStorage.getItem("transition_time"));
    }
    setTimeout(()=>delete fading_out_places[place_name], localStorage.getItem("transition_time"));
}

export function start_place(place_name, sounds_list, muffled_amount, getSoundUrls){
    if(place_name in currently_playing_places){
        currently_playing_places[place_name].filter.frequency.setValueAtTime(
            muffle_amount_to_frequency(muffled_amount), 
            Howler.ctx.currentTime, 
            localStorage.getItem("transition_time")/1000);
        return;
    }
    let new_filter = Howler.ctx.createBiquadFilter();
    new_filter.type = "lowpass";
    new_filter.frequency.setValueAtTime(
        muffle_amount_to_frequency(muffled_amount), 
        Howler.ctx.currentTime);
    new_filter.Q.setValueAtTime(0.707, Howler.ctx.currentTime);
    new_filter.connect(Howler.ctx.destination);
    console.log(Howler.ctx==new_filter.context);

    currently_playing_places[place_name] = {
        howls: [],
        filter: new_filter
    }
    for(let sound_descr of sounds_list){
        let sound_urls = getSoundUrls(sound_descr.name);
        if(sound_urls.length==0) continue;
        let random_url = sound_urls[Math.floor(Math.random()*sound_urls.length)];
        let new_howl = new Howl({
            src: ['https://corsproxy.io/?' + encodeURIComponent(random_url)],
            autoplay: false,
            volume: sound_descr.volume
        });
        let time = (Math.random()/2)*sound_descr.average_time*1000;
        setTimeout(()=>{
            new_howl.play();
            console.log(new_howl._sounds[0]._node);
            console.log(new_howl._sounds[0]._node.context==Howler.ctx);
            new_howl._sounds[0]._node.disconnect();
            new_howl._sounds[0]._node.connect(new_filter);
        }, time);
        new_howl.on('end', ()=>{
            let time = (Math.random()/2+0.5)*sound_descr.average_time*1000;
            setTimeout(()=>new_howl.play(), time);
        })
    }
}