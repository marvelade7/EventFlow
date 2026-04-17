import React from 'react';
import Logo from './Logo';
import './sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ mobileOpen = false }) => {
    return (
        <div className={`sidebar bg-white ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
            <div>
                <div data-aos='fade-right' data-aos-delay='60'>
                    <Logo size={40} fontSize='1.25em' />
                </div>
                <ul className='links'>
                    <Link to='/dashboard' className='text-decoration-none text-dark w-100'><li data-aos='fade-right' data-aos-delay='90'><i className='bi bi-grid fs-5'></i> Dashboard</li></Link>
                    <li data-aos='fade-right' data-aos-delay='130'><i className='bi bi-search fs-5'></i> Browse Events</li>
                    <li data-aos='fade-right' data-aos-delay='170'><i className='bi bi-clipboard2-check fs-5'></i> My Bookings</li>
                    <li className='mb-2' data-aos='fade-right' data-aos-delay='210'><i className='bi bi-gift'></i> My Tickets</li>
                    <hr className='w-100' style={{color: 'rgba(0,0,0,.4)'}} />
                    <Link to='/my-event' className='text-decoration-none text-dark w-100'><li data-aos='fade-right' data-aos-delay='250'><i className='bi bi-archive'></i> My Events</li></Link>
                    <Link to='/create-event' className='text-decoration-none text-dark w-100'><li data-aos='fade-right' data-aos-delay='290'><i className='bi bi-plus-circle'></i> Create Event</li></Link>
                </ul>
            </div>
            <div className="profile " data-aos='fade-up' data-aos-delay='320'>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" width="40" height="40" className='rounded-5 ' />
                <p className="m-0 fw-semibold w-100">John Doe</p>
            </div>
        </div>
    );
};

export default Sidebar;