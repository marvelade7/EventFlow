import React from 'react';

const EventMedia = () => {
    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{ padding: '2px 10px', backgroundColor: 'rgb(17,213,243)' }} className="m-0 rounded-5 text-white fw-semibold w-auto">5</p>
                <h5 className='m-0'>Event Media</h5>
            </div>
            <div style={{border: '1px dashed rgba(0,0,0,.3)', cursor: 'pointer'}} className='text-secondary event-media text-center w-100 py-5 px-4 rounded-3'>
                <i style={{backgroundColor: 'rgb(243,244,246)', padding: '5px 10px'}} className='bi bi-upload fs-4 rounded-3'></i>
                <h6 className='mt-3'>Drag image here or click to browse</h6>
            </div>
        </div>
    );
};

export default EventMedia;