import React from 'react';
import Logo from './Logo';
import './sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ mobileOpen = false }) => {
    return (
        <div className={`sidebar bg-white ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
            <div>
                <div>
                    <Logo size={40} fontSize='1.25em' />
                </div>
                <ul className='links'>
                    <NavLink end to='/dashboard' className={({ isActive }) => `text-decoration-none text-dark w-100 sidebar-link ${isActive ? 'active' : ''}`}><li><i className='bi bi-grid fs-5'></i> Dashboard</li></NavLink>
                    <NavLink to='/dashboard/browse-event' className={({ isActive }) => `text-decoration-none text-dark w-100 sidebar-link ${isActive ? 'active' : ''}`}><li><i className='bi bi-search fs-5'></i> Browse Events</li></NavLink>
                    <NavLink to='/dashboard/tickets' className={({ isActive }) => `text-decoration-none text-dark w-100 sidebar-link ${isActive ? 'active' : ''}`}><li className='mb-2'><i className='bi bi-gift'></i> My Tickets</li></NavLink>
                    <NavLink to='/dashboard/profile' className={({ isActive }) => `text-decoration-none text-dark w-100 sidebar-link ${isActive ? 'active' : ''}`}><li><i className='bi bi-person fs-5'></i> My Profile</li></NavLink>
                    <hr className='w-100' style={{color: 'rgba(0,0,0,.4)'}} />
                    <NavLink to='/dashboard/my-event' className={({ isActive }) => `text-decoration-none text-dark w-100 sidebar-link ${isActive ? 'active' : ''}`}><li><i className='bi bi-archive'></i> My Events</li></NavLink>
                    <NavLink to='/dashboard/create-event' className={({ isActive }) => `text-decoration-none text-dark w-100 sidebar-link ${isActive ? 'active' : ''}`}><li><i className='bi bi-plus-circle'></i> Create Event</li></NavLink>
                </ul>
            </div>

            <div className="profile">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" width="40" height="40" className='rounded-5 ' />
                <p className="m-0 fw-semibold w-100">John Doe</p>
            </div>
        </div>
    );
};

export default Sidebar;