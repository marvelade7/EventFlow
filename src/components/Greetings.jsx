import React from 'react';
import GetTimeOfDay from './GetTimeOfDay';

const Greetings = ({firstName, lastName}) => {
    const getDate = new Date()
    const formattedDate = getDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    return (
        <div style={{background: 'rgb(27, 181, 204)'}} className='px-5 py-4 mx-4 my-3 rounded-4 text-white'>
            <h3 className='m-0 mb-1 fw-semibold'>Good <GetTimeOfDay/>, {firstName} {lastName}</h3>
            <p className="m-0 fw-semibold">{formattedDate}</p>
        </div>
    );
};

export default Greetings;