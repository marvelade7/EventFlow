import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerDiv = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    return (
        <div className='footer' style={{ backgroundColor: 'rgb(17,24,39)', padding: '3em 10em', color: 'rgb(145,151,162)' }}>
            <div className='d-flex align-items-start justify-content-between gap-5'>
                <div style={footerDiv}>
                    <Link to='/' className='text-decoration-none'>
                        <div className='text-white d-flex align-items-center gap-2'>
                            <img src="eventLogo.png" width="40" />
                            <h5 className='m-0'>Event<span>Flow</span></h5>
                        </div>
                    </Link>
                    <p className='m-0 w-75'>The modern platform for event discovery and ticket management.</p>
                </div>
                <div style={footerDiv}>
                    <h6 className='text-white m-0'>Platform</h6>
                    <div>
                        <p className='m-0 mb-1'>Browse Events</p>
                        <p className='m-0 mb-1'>Create Events</p>
                        <p className='m-0 mb-1'>Pricing</p>
                    </div>
                </div>
                <div style={footerDiv}>
                    <h6 className='text-white m-0'>Company</h6>
                    <div>
                        <p className='m-0 mb-1'>About</p>
                        <p className='m-0 mb-1'>Blog</p>
                        <p className='m-0 mb-1'>Careers</p>
                    </div>
                </div>
                <div style={footerDiv}>
                    <h6 className='text-white m-0'>Newsletter</h6>
                    <div className='footer-btns d-flex gap-3'>
                        <input className='form-control shadow-none border-3 m-0' type="email" placeholder='your@example.com' name='email' />
                        <button className='btn btn-primary'>Subscribe</button>
                    </div>
                </div>
            </div>
            <div className='d-flex align-items-center justify-content-between mt-5 pt-4 border-top border-secondary'>
                <p>&copy; 2026 EventFlow. All rights reserved.</p>
                <div className='d-flex align-items-center gap-3'>
                    <p>Privacy</p>
                    <p>Terms</p>
                    <p>Support</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;