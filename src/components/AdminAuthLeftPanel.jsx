import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const AdminAuthLeftPanel = () => {
    const style = {
        background: 'rgb(38,35,98)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        color: 'white',
        padding: '4em',
        height: '100vh',
        width: '50vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '4em',
        alignItems: 'start',
        justifyContent: 'start',
    };
    return (
        <div style={style}>
            <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
                <div className='d-flex align-items-center gap-1 top-0'>
                    <img src="/eventLogo.png" width="40" />
                    <h5 className='m-0'>EventFlow</h5>
                </div>
            </Link>
            <div>
                <i style={{ fontSize: '4em' }} className='bi bi-shield-shaded'></i>
                <h2>Admin Control Center</h2>
                <p className='fs-5 m-0'>Manage events, users, and platform analytics from one powerful dashboard.</p>
            </div>
            <div style={{ backgroundColor: 'rgb(62,66,110)' }} className='fadeAndSlide  py-3 px-3 rounded-3 w-100 d-flex flex-column align-items-center justify-content-between gap-3'>
                <div className='d-flex align-items-center justify-content-between gap-3 w-100'>
                    <div style={{ background: 'rgb(84,85,131)' }} className='p-3 rounded-3 w-100 '>
                        <h6 className='m-0'>Total Users</h6>
                        <p className='fs-4 fw-semibold m-0'>12,847</p>
                    </div>
                    <div style={{ background: 'rgb(84,85,131)' }} className='p-3 rounded-3 w-100 '>
                        <h6 className='m-0'>Revenue</h6>
                        <p className='fs-4 fw-semibold m-0'>$284K</p>
                    </div>
                </div>
                <div style={{ background: 'rgb(84,85,131)' }} className='p-5 rounded-3 w-100 '>

                </div>
            </div>
        </div>
    );
};

export default AdminAuthLeftPanel;