import React from 'react';

const DashNavbar = ({title}) => {
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
        <div style={nav}>
            <h5 className='m-0'>Dashboard</h5>
            <div className='d-flex align-items-center gap-3'>
                <div className='border border-black rounded-2 d-flex align-items-center gap-2 py-1 px-3 input-group'>
                    <i className='bi bi-search'></i>
                    <input type="text" placeholder='Search events...' style={{border: 'none', outline: 'none'}} className='' />
                </div>
                <i className='bi bi-bell fs-5'></i>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" width="35" className='rounded-5 ' />
            </div>
        </div>
    );
};

export default DashNavbar;