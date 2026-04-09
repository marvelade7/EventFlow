import React from 'react';

const BrowseEvent = () => {
    const filterEvent = {
        backgroundColor: 'rgb(234, 238, 246)'
    };
    const browseEvents = {
        backgroundColor: 'white',
        padding: '5em 8em',
        display: 'flex',
        flexDirection: 'column',
    };
    return (
        <>
            <div className='browse-events' style={browseEvents}>
                <div className='header d-flex align-items-start justify-content-between gap-3'>
                    <h2 className='fw-semibold m-0'>What's Happening Near You</h2>
                    <p className="m-0 text-primary text-decoration-underline fw-semibold">View All</p>
                </div>
                <div className='d-flex align-items-center gap-3 my-4'>
                    <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>All</p>
                    <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Music</p>
                    <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Tech</p>
                    <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Sports</p>
                    <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Arts</p>
                    <p style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Foods</p>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <p className='card-text border gap-2 m-0 rounded-5 w-auto d-inline-flex px-2'><i className="bi bi-music-note-beamed border rounded-5"></i> Music</p>
                                <h5 className="card-title mt-3">Summer Beats Festival 2025</h5>
                                <p className="card-text"><i className="bi bi-calendar me-1 "></i> August 15, 2026</p>
                                <p className="card-text"><i className="bi bi-geo-alt-fill me-1 "></i>Madison Square Garden</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <p className='card-text border gap-2 m-0 rounded-5 w-auto d-inline-flex px-2'><i className="bi bi-laptop"></i> Tech</p>
                                <h5 className="card-title mt-3">Tech Conference 2025</h5>
                                <p className="card-text"><i className="bi bi-calendar me-1 "></i> September 10, 2026</p>
                                <p className="card-text"><i className="bi bi-geo-alt-fill me-1 "></i>Convention Center</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <p className='card-text border gap-2 m-0 rounded-5 w-auto d-inline-flex px-2'><i className="bi bi-laptop"></i> Food</p>
                                <h5 className="card-title mt-3">Brooklyn Gourmet Night Market</h5>
                                <p className="card-text"><i className="bi bi-calendar me-1 "></i> Jul 28, 2026</p>
                                <p className="card-text"><i className="bi bi-geo-alt-fill me-1 "></i>Prospect Park</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrowseEvent;