import {Howl, Howler} from 'howler';

export function startAudioContext(){
    Howler.volume(1);
    console.log("starting audio context");
    let first_sound = new Howl({
        src: ['https://freesound.org/data/previews/80/80921_1022651-lq.mp3']
    });
    // // Clear listener after first call.
    // first_sound.once('load', function(){
    //     console.log("first sound loaded");
    //     first_sound.play();
    // });
    first_sound.on('end', function(){
        console.log("first sound ended");
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
    currently_playing_places[place_name].filter.disconnect();
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
    console.log("muffled freq: "+muffle_amount_to_frequency(muffled_amount));
    new_filter.frequency.setValueAtTime(
        muffle_amount_to_frequency(muffled_amount), 
        Howler.ctx.currentTime);
    new_filter.Q.setValueAtTime(0.707, Howler.ctx.currentTime);
    new_filter.connect(Howler.masterGain);

    currently_playing_places[place_name] = {
        howls: [],
        filter: new_filter
    }
    for(let sound_descr of sounds_list){
        let sound_urls = getSoundUrls(sound_descr.name);
        if(sound_urls.length==0) continue;
        let random_url = sound_urls[Math.floor(Math.random()*sound_urls.length)];
        console.log('https://corsproxy.io/?' + encodeURIComponent(random_url));
        let new_howl = new Howl({
            // src: ['https://corsproxy.io/?' + encodeURIComponent(random_url)],
            src: [random_url],
            autoplay: false,
            volume: sound_descr.volume
        });
        currently_playing_places[place_name].howls.push(new_howl);
        let time = (Math.random()/2)*sound_descr.average_time*1000;
        setTimeout(()=>{
            new_howl.play();
            new_howl._sounds[0]._node.disconnect();
            new_howl._sounds[0]._node.connect(new_filter);
        }, time);
        new_howl.on('end', ()=>{
            let time = (Math.random()/2+0.5)*sound_descr.average_time*1000;
            setTimeout(()=>{
                new_howl.play();
                console.log("playing "+random_url);
            }, time);
        })
    }
}