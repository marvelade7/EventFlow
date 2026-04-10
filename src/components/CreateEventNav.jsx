import React from 'react';

const CreateEventNav = () => {
    const nav = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px',
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,.12)',
        // position: 'sticky',
        // top: 0,
        zIndex: '1000'
    };
    return (
        <div style={nav}>
            <h5 className='m-0'>Create New Event</h5>
            <div className='d-flex align-items-center gap-3'>
                <button className='btn btn-outline-light text-dark border rounded-3 py-2 px-3'>Save Draft</button>
                <button style={{backgroundColor: 'rgb(17,213,243)'}} className='btn rounded-3 text-white py-2 fw-semibold px-3'>Publish Event</button>
            </div>
        </div>
    );
};

export default CreateEventNav;