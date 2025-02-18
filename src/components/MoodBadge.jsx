import { useStateContext } from "../StateContext";

function MoodBadge({ moodName }) {

    const { currentMood, updateCurrentMood } = useStateContext();

    return (
        <button key={moodName+"-btn"}
                className={'btn btn-'+(currentMood==moodName?'':'outline-')+'primary btn-sm'}
                >
            <a href='#' className='text-decoration-none text-reset text-capitalize' onClick={()=>{
                localStorage.setItem("current_mood", moodName);
                updateCurrentMood(moodName);
                }}>
                {moodName}
            </a>
            {moodName!="none" && <a href='#' className='icon-link text-decoration-none text-reset ms-2' onClick={()=>{set_edited_mood_name(moodName);set_right_editor_mode("mood")}}>
                <i className="fa-solid fa-square-pen"></i>
            </a>}
        </button>
    );
}

export default MoodBadge;