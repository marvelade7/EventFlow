import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CreateEventNav from '../components/CreateEventNav';
import EventBasis from '../components/EventBasis';
import DateAndTimeForm from '../components/DateAndTimeForm';
import Location from '../components/Location';
import Tickets from '../components/Tickets';
import EventMedia from '../components/EventMedia';
import LivePreview from '../components/LivePreview';

const CreateNewEventPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className='create-event-page'>
            <Sidebar mobileOpen={sidebarOpen} />
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <div className='create-event-main' style={{ marginLeft: '300px', background: 'rgb(249,250,251)' }}>
                <CreateEventNav
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    isSidebarOpen={sidebarOpen}
                />
                <div className='d-flex gap-3 px-4 pb-4 mt-2 create-event-layout'>
                    <div className='create-event-form-column' style={{width: '70%'}}>
                        <div className='my-4'>
                            <EventBasis />
                        </div>
                        <div className='my-4'>
                            <DateAndTimeForm />
                        </div>
                        <div className='my-4'>
                            <Location />
                        </div>
                        <div className='my-4'>
                            <Tickets />
                        </div>
                        <div>
                            <EventMedia />
                        </div>
                    </div>
                    <div className='py-4 create-event-preview-column' style={{width: '30%'}}>
                        <LivePreview />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewEventPage;