import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import CreateEventNav from '../components/CreateEventNav';
import EventBasis from '../components/EventBasis';
import DateAndTimeForm from '../components/DateAndTimeForm';
import Location from '../components/Location';
import Tickets from '../components/Tickets';
import EventMedia from '../components/EventMedia';
import LivePreview from '../components/LivePreview';
import aos from 'aos';
import 'aos/dist/aos.css';

const CreateNewEventPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        aos.init({
            duration: 750,
            once: true,
            easing: 'ease-out-cubic',
            offset: 30,
        });
    }, []);

    return (
        <div className='create-event-page'>
            <Sidebar mobileOpen={sidebarOpen} />
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <div className='create-event-main' style={{ marginLeft: '300px', background: 'rgb(249,250,251)' }}>
                <div data-aos='fade-down'>
                    <CreateEventNav
                        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                        isSidebarOpen={sidebarOpen}
                    />
                </div>
                <div className='d-flex gap-3 px-4 pb-4 mt-2 create-event-layout'>
                    <div className='create-event-form-column' style={{width: '70%'}}>
                        <div className='my-4' data-aos='fade-up' data-aos-delay='60'>
                            <EventBasis />
                        </div>
                        <div className='my-4' data-aos='fade-up' data-aos-delay='110'>
                            <DateAndTimeForm />
                        </div>
                        <div className='my-4' data-aos='fade-up' data-aos-delay='160'>
                            <Location />
                        </div>
                        <div className='my-4' data-aos='fade-up' data-aos-delay='210'>
                            <Tickets />
                        </div>
                        <div data-aos='fade-up' data-aos-delay='260'>
                            <EventMedia />
                        </div>
                    </div>
                    <div className='py-4 create-event-preview-column' style={{width: '30%'}} data-aos='fade-left' data-aos-delay='180'>
                        <LivePreview />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewEventPage;