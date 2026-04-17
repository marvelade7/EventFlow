import React from 'react';

const BrowseEventsHead = ({title, style, view, onViewAll}) => {
    return (
        <div>
            <div className='header d-flex align-items-start justify-content-between gap-3'>
                <h2 style={style} className='fw-semibold m-0'>{title}</h2>
                {view && (
                    <button
                        type='button'
                        onClick={onViewAll}
                        className='btn p-0 border-0 bg-transparent m-0 text-primary text-decoration-underline fw-semibold'
                    >
                        {view}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BrowseEventsHead;