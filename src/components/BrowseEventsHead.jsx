import React from 'react';

const BrowseEventsHead = ({title, style, view}) => {
    return (
        <div>
            <div className='header d-flex align-items-start justify-content-between gap-3'>
                <h2 style={style} className='fw-semibold m-0'>{title}</h2>
                <p className="m-0 text-primary text-decoration-underline fw-semibold">{view}</p>
            </div>
        </div>
    );
};

export default BrowseEventsHead;