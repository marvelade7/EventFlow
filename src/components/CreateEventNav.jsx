import React from 'react';

const CreateEventNav = ({
    onToggleSidebar,
    isSidebarOpen,
    onSaveDraft,
    isSubmitting,
    isPublishDisabled = false,
    title,
    actionLabel,
    onActionClick,
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
        zIndex: 1040,
    };
    return (
        <div className='create-event-nav' style={nav}>
            <div className='d-flex align-items-center gap-2'>
                <button
                    type='button'
                    onClick={onToggleSidebar}
                    className='btn btn-light border create-event-menu-btn'
                    aria-label='Toggle sidebar'
                >
                    <i className={`bi ${isSidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                </button>

                {/* <h5 className='m-0'>Creta</h5> */}
                <h5 className='m-0'>{title}</h5>
            </div>
            <div className='d-flex align-items-center gap-3 create-event-actions'>
                {actionLabel ? (
                    <button
                        type='button'
                        onClick={onActionClick}
                        style={{ backgroundColor: 'rgb(17,213,243)' }}
                        className='btn rounded-3 text-white py-2 fw-semibold px-3'
                    >
                        {actionLabel}
                    </button>
                ) : (
                    <>
                        <button type='button' onClick={onSaveDraft} className='btn btn-outline-light text-dark border rounded-3 py-2 px-3'>Save Draft</button>
                        <button type='submit' disabled={isSubmitting || isPublishDisabled} style={{backgroundColor: 'rgb(17,213,243)'}} className='btn rounded-3 text-white py-2 fw-semibold px-3'>
                            {isSubmitting ? 'Publishing...' : 'Publish Event'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateEventNav;
