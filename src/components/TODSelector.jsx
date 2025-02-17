import React from 'react';
import TODRadioButton from './TODRadioButton';

const TODSelector = () => {
    return (
        <div className='d-flex align-items-center justify-content-between justify-content-md-start gap-md-3 gap-1 p-2 flex-wrap'>
            <div className='text-nowrap'>Time of day:</div>
            <TODRadioButton val="morning" />
            <TODRadioButton val="day" />
            <TODRadioButton val="evening" />
            <TODRadioButton val="night" />
        </div>
    );
};

export default TODSelector;