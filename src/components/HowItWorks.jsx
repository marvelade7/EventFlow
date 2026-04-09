import React from 'react';

const HowItWorks = () => {
    return (
        <div className='how-it-works' style={{backgroundColor: 'rgb(249,250,251)', padding: '5em 8em'}}>
            <h2 className='fw-semibold fs-2 text-center'>How It Works</h2>
            <div className='d-flex align-items-center gap-5 justify-content-center mt-5'>
                <div className='text-center'>
                    <i className="bi bi-search fs-2 text-primary"></i>
                    <h4 className='fw-semibold mt-3'>Discover Events</h4>
                    <p >Browse thousands of events by category, location, or date. Find exactly what excites you.</p>
                </div>
                <div className='text-center'>
                    <i className="bi bi-cart fs-2 text-warning"></i>
                    <h4 className='fw-semibold mt-3'>Book Tickets</h4>
                    <p>Secure checkout in under 60 seconds. Instant confirmation and digital tickets delivered.</p>
                </div>
                <div className='text-center'>
                    <i className="bi bi-geo-alt-fill fs-2 text-success"></i>
                    <h4 className='fw-semibold mt-3'>Attend Events</h4>
                    <p>Show your QR code at the entrance and enjoy the experience. It's that simple.</p>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;