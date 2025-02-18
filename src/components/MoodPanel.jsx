import React, { useState } from 'react';
import MoodBadge from './MoodBadge';

const MoodPanel = ({ set_edited_mood_name, set_right_editor_mode }) => {
    const [moodOpened, setMoodOpened] = useState(false);
    
    const { moods, addMood } = useDataTree();
    const { moodVolume, updateMoodVolume } = useStateContext();

    const moodBadges = Object.keys(moods).map((moodName) =>
        <MoodBadge key={moodName + "-badge"} moodName={moodName} />
    );

    return (
        <div className={'card'}>
            <div className='card-header small'>
                <div className='d-flex gap-4'>
                    <a href='#' onClick={() => setMoodOpened(!moodOpened)} className="icon-link text-decoration-none text-reset">
                        <i className={"fa-solid fa-chevron-" + (moodOpened ? "down" : "up")}></i>
                    </a>
                    Mood
                    <div className='d-flex flex-row align-items-center gap-2 flex-grow-1'>
                        <i className="fa-solid fa-volume-low"></i>
                        <input
                            type="range"
                            value={moodVolume}
                            onChange={(e) => {
                                updateMoodVolume(e.target.value);
                            }}
                            className="form-range"
                            min="0"
                            max="1"
                            step='.05'
                        />
                        <i className="fa-solid fa-volume-high"></i>
                    </div>
                </div>
            </div>
            {moodOpened && (
                <div className='card-body'>
                    <div className='d-flex flex-row gap-2 align-items-center'>
                        {moodBadges}
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                                set_edited_mood_name(addMood());
                                set_right_editor_mode("mood");
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoodPanel;