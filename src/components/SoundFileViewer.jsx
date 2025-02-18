import React from 'react';
import EditableText from './EditableText';

const SoundFileViewer = ({ soundName, soundPackName, soundFileIndex }) => {

    const { sounds, changeSound } = useDataTree();
    const soundInfo = sounds[soundName];
    const soundPack = soundInfo.sound_packs[soundPackName];
    const soundFile = soundPack.sound_files[soundFileIndex];

    function changeSoundFile(property, new_value){
        let new_sound_pack = {...soundPack};
        new_sound_pack.sound_files[soundFileIndex][property] = new_value;
        let new_sound_info = {...soundInfo};
        new_sound_info.sound_packs[soundPackName] = new_sound_pack;
        changeSound(soundName, soundName, new_sound_info);
    }

    function deleteSoundFile(){
        let new_sound_pack = {...soundPack};
        new_sound_pack.sound_files.splice(soundFileIndex, 1);
        let new_sound_info = {...soundInfo};
        new_sound_info.sound_packs[soundPackName] = new_sound_pack;
        changeSound(soundName, soundName, new_sound_info);
    }

    return (
        <li className="list-group-item">
            <div className="row">
                <div className="col-11 d-flex flex-column gap-2">
                    <div className="pe-2 overflow-hidden">
                        <EditableText
                            base_text={soundFile.url}
                            edit_prompt={"Enter the URL of the sound file"}
                            applyChange={(new_url) => changeSoundFile(i, "url", new_url)}
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center gap-2">
                        <audio controls className="w-100">
                            <source src={soundFile.url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <div className="d-flex flex-row align-items-center gap-2">
                            <small>Volume multiplier</small>
                            <input
                                type='number'
                                className="form-control form-control-sm"
                                value={soundFile.volume_mul}
                                onChange={(e) => changeSoundFile(i, "volume_mul", e.target.value)}
                                min={0}
                                max={2}
                                step={0.05}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-1">
                    <button
                        type="button"
                        className="btn btn-outline-danger h-100 w-100"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this sound file?")) {
                                deleteSoundFile(i);
                            }
                        }}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default SoundFileViewer;