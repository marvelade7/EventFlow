import React from 'react';
import Avatar from './Avatar';

const DashNavbar = ({
    title,
    onToggleSidebar,
    isSidebarOpen,
    firstName,
    lastName,
    avatar,
}) => {
    const nav = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px',
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,.12)',
        position: 'sticky',
        top: 0,
        zIndex: '1000'
    }
    return (
        <div className='dash-navbar' style={nav}>
            <div className='d-flex align-items-center gap-2'>
                <button
                    type='button'
                    onClick={onToggleSidebar}
                    className='btn btn-light border dashboard-menu-btn'
                    aria-label='Toggle sidebar'
                >
                    <i className={`bi ${isSidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                </button>
                <h5 className='m-0'>{title || 'Dashboard'}</h5>
            </div>
            <div className='d-flex align-items-center gap-3 dash-navbar-actions'>
                <div className='border border-black rounded-2 d-flex align-items-center gap-2 py-1 px-3 input-group'>
                    <i className='bi bi-search'></i>
                    <input type="text" placeholder='Search events...' style={{border: 'none', outline: 'none'}} className='' />
                </div>
                <i className='bi bi-bell fs-5'></i>
                <Avatar
                    firstName={firstName}
                    lastName={lastName}
                    avatarUrl={avatar}
                    width="50px"
                    height="40px"
                    fontSize="14px"
                />
            </div>
        </div>
    );
};

export default DashNavbar;