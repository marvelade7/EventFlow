import React from 'react';

const HostEvent = () => {
    return (
        <div>
            <div style={{ backgroundColor: 'rgb(37,43,78)', padding: '5em 10em' }} className='host-events d-flex align-items-center justify-content-between text-white gap-5'>
                <div>
                    <h2 className='fw-semibold fs-2 mb-2'>Ready To Host Your Own Event?</h2>
                    <p style={{fontSize:'1.1em'}} className='m-0'>Join 500+ organizers who trust EventFlow to sell tickets and manage their events.</p>
                </div>
                <button style={{fontSize:'1.1em'}} className='btn btn-light fw-semibold text-primary px-4 py-2'>Start For Free <i className="bi bi-arrow-right"></i></button>
            </div>
        </div>
    );
};

export default HostEvent;