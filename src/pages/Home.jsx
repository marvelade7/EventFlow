import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BrowseEvent from '../components/BrowseEvent';
import HowItWorks from '../components/HowItWorks';
import HostEvent from '../components/HostEvent';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <BrowseEvent />
            <HowItWorks />
            <HostEvent />
            <Footer />
        </>
    );
};

export default Home;