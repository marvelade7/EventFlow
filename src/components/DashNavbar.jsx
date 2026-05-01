import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

const DashNavbar = ({
    title,
    onToggleSidebar,
    isSidebarOpen,
    firstName,
    lastName,
    avatar,
}) => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/signin", { replace: true });
    };

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
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Avatar
                            firstName={firstName}
                            lastName={lastName}
                            avatarUrl={avatar}
                            width="50px"
                            height="40px"
                            fontSize="14px"
                        />
                    </div>
                    {showProfileMenu && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1001,
                                minWidth: '180px',
                                marginTop: '5px',
                            }}
                        >
                            <div style={{ padding: '12px 0' }}>
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate('/dashboard/profile');
                                    }}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        background: 'none',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                    className='d-flex align-items-center gap-2'
                                    onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                                >
                                    <i className='bi bi-person'></i>
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        background: 'none',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: '#dc3545',
                                    }}
                                    className='d-flex align-items-center gap-2'
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <i className='bi bi-box-arrow-right'></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashNavbar;