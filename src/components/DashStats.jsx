import React from 'react';

const DashStats = ({icon, status, num, title, icon2, iconStyle, statusStyle} ) => {
    return (
        <div className='bg-white rounded-3 card py-3 px-4 border-0 shadow-sm w-100'>
            <div className='d-flex align-items-start justify-content-between mb-3'>
                <i className={icon} style={iconStyle}></i>
                <p style={statusStyle} className="m-0"><i className={icon2}></i> {status}</p>
            </div>
            <h3 className='m-0'>{num}</h3>
            <p className='m-0'>{title}</p>
        </div>
    );
};

export default DashStats;