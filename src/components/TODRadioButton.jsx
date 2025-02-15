import { useStateContext } from "../StateContext";
import { RadioButton } from "./RadioButton";

function TODRadioButton({ TOD }) {
    const { timeOfDay, updateTimeOfDay } = useStateContext();
    return (
        <RadioButton val={TOD} 
            onChange={()=>{ updateTimeOfDay(TOD) }}
            checked={timeOfDay==TOD}/>
    );
}

export default TODRadioButton;