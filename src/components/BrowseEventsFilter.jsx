import React from 'react';

const BrowseEventsFilter = ({filterEvent}) => {
    return (
        <div>
            <div className='d-flex align-items-center gap-3 my-4'>
                <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>All</p>
                <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Music</p>
                <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Tech</p>
                <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Sports</p>
                <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Arts</p>
                <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Foods</p>
            </div>
        </div>
    );
};

export default BrowseEventsFilter;