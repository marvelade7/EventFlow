import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashNavbar from '../components/DashNavbar';
import Greetings from '../components/Greetings';
import DashStats from '../components/DashStats';
import CreateEvent from '../components/CreateEvent';
import BrowseEvent from '../components/BrowseEvent';
import BrowseEventsHead from '../components/BrowseEventsHead';
import RecentBookings from '../components/RecentBookings';
import aos from 'aos';
import 'aos/dist/aos.css';

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        aos.init({
            duration: 1500,
            once: true,
            easing: "ease-out-cubic",
            offset: 30,
        });
    }, []);

    const browseEvents = {
        // backgroundColor: 'white',
        padding: '3em 2em',
        display: 'flex',
        flexDirection: 'column',
        scrollMarginTop: '60px'
    };

    return (
        <div className='dashboard-page'>
            <Sidebar mobileOpen={sidebarOpen} />
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <div className='dashboard-main' style={{ marginLeft: '300px', background: 'rgb(249,250,251)' }}>
                <DashNavbar
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    isSidebarOpen={sidebarOpen}
                />
                <div data-aos='fade-left' >
                    <Greetings />
                </div>
                <div className='d-flex align-items-center justify-items-between gap-3 pt-3 pb-5 mx-4 dashboard-stats'>
                    <div data-aos='fade-up' data-aos-delay='80' className='w-100'>
                        <DashStats icon='bi bi-archive' icon2='bi bi-arrow-up' iconStyle={{ fontSize: '1.4em', background: 'rgba(0,0,256,.12)', color: 'rgb(89,68,231)', padding: '5px 10px', borderRadius: '7px' }} status='3' num='5' title='Upcoming Events' statusStyle={{ color: 'green', background: 'rgb(209,250,229)', padding: '1px 10px', borderRadius: '20px', fontWeight: '600', fontSize: '.8em' }} />
                    </div>
                    <div data-aos='fade-up' data-aos-delay='140' className='w-100'>
                        <DashStats icon='bi bi-archive text-warning' iconStyle={{ fontSize: '1.4em', background: 'rgb(255,251,235)', padding: '5px 10px', borderRadius: '7px' }} status='Active' num='8' title='Active Tickets' statusStyle={{ color: 'green', background: 'rgb(209,250,229)', padding: '2px 10px', borderRadius: '20px', fontWeight: '600', fontSize: '.8em' }} />
                    </div>
                    <div data-aos='fade-up' data-aos-delay='200' className='w-100'>
                        <DashStats icon='bi bi-people' iconStyle={{ fontSize: '1.4em', background: 'rgba(27, 180, 204, 0.16)', color: 'rgb(27,181,204)', padding: '5px 10px', borderRadius: '7px' }} status='All time' num='23' title='Events Attended' statusStyle={{ color: 'black', background: 'rgb(243,244,246)', padding: '2px 10px', borderRadius: '20px', fontWeight: '600', fontSize: '.8em' }} />
                    </div>
                </div>
                <div className='mx-4 pb-4' data-aos='zoom-in-up' data-aos-delay='90'>
                    <CreateEvent />
                </div>
                <div style={browseEvents} data-aos='fade-up'>
                    <BrowseEventsHead style={{ fontSize: '1.5em' }} title='Upcoming Events' view='View all' />
                    <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
                        <BrowseEvent
                            img='https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'
                            title='Summer Beats Festival 2025'
                            venue='Madison Square Garden'
                            date='August 15, 2026'
                            event='Music'
                            eventIcon='bi bi-music-note-beamed'
                            price='$49'
                            button='Book Now'
                            anim='fade-up'
                            delay='70'
                            btnStyle={{backgroundColor: 'rgb(27,181,204)'}} />

                        <BrowseEvent
                            img='https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop'
                            title='Tech Conference 2025'
                            venue='Convention Center'
                            date='September 10, 2026'
                            event='Tech'
                            price='$129'
                            eventIcon='bi bi-laptop'
                            button='Book Now'
                            anim='fade-up'
                            delay='140'
                            btnStyle={{backgroundColor: 'rgb(27,181,204)'}} />

                        <BrowseEvent
                            img='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop'
                            title='Brooklyn Gourmet Night Market'
                            venue='Prospect Park'
                            date='Jul 28, 2026'
                            event='Food'
                            price='$25'
                            eventIcon='bi bi-laptop'
                            button='Book Now'
                            anim='fade-up'
                            delay='210'
                            btnStyle={{backgroundColor: 'rgb(27,181,204)'}} />
                    </div>
                </div>
                <div style={browseEvents} data-aos='fade-up' data-aos-delay='80'>
                    <BrowseEventsHead title='My Recent Bookings' style={{fontSize: '1.3em'}} />
                    <div data-aos='fade-up' data-aos-delay='140'>
                        <RecentBookings />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;