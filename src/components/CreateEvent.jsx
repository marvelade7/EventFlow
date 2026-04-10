import React from 'react';

const CreateEvent = () => {
    return (
        <div className='create-event'>
            <div className=' d-flex align-items-center gap-3'>
                <i style={{ background: 'rgb(27,181,204,.15)', color: 'rgb(27,181,204)' }} className='bi bi-plus-circle py-2 px-3 rounded-3 fs-4'></i>
                <div>
                    <h5 className='m-0'>Create new event</h5>
                    <p className='m-0'>Start creating your next event and sell tickets instantly</p>
                </div>
            </div>
            <i className='bi bi-chevron-right'></i>
        </div>
    );
};

export default CreateEvent;