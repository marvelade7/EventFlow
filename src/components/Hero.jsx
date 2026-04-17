import React, { useEffect } from 'react';
import carousel1 from '../assets/images/carousel1.webp';
import carousel2 from '../assets/images/carousel2.webp';
import carousel3 from '../assets/images/carousel3.webp';
import carousel4 from '../assets/images/carousel4.webp';
import carousel5 from '../assets/images/carousel5.webp';
import Navbar from './Navbar';
import aos from "aos";
import "aos/dist/aos.css";

const Hero = ({ onBrowseEvents, onCreateEvent }) => {
    useEffect(() => {
        aos.init({ 
            duration: 1500,
            once: true, 
        });
    }, []);


    return (
        <>
            <div className=''>
                <div id="carouselExampleSlidesOnly" className="carousel slide text-white" data-bs-ride="carousel">
                {/* <Navbar /> */}
                    <div data-aos="fade-up" className="hero-section carousel-fixed-content d-flex flex-column align-items-center justify-content-center">
                        <h2 className='fw-bold m-0 text-center' style={{ fontSize: '3em' }}>Discover Events. Book Instantly.</h2>
                        <h2 className='fw-bold m-0 text-center' style={{ color: 'rgb(255, 202, 44)', fontSize: '3em' }}>Experience More.</h2>
                        <p className='w-50 fs-5 m-0 my-4 text-center px-4 py-4'>The all-in-one platform for discovering unforgettable events and managing tickets effortlessly. From concerts to conferences — your next experience is one click away.</p>
                        <div className='btns mt-3 d-flex align-items-center gap-4'>
                            <button onClick={onBrowseEvents} data-aos="fade-right" style={{fontSize: '1.1em', padding: '8px 24px'}} className='hero-btn btn btn-warning text-dark w-auto fw-semibold '>Browse Events</button>
                            <button onClick={onCreateEvent} data-aos="fade-left" style={{fontSize: '1.1em', padding: '8px 24px'}} className='hero-btn btn btn-outline-light w-auto fw-semibold '>Create an event</button>
                        </div>
                    </div>

                    <div className="carousel-inner">
                        <div className="carousel-item ">
                            <img src={carousel1} className="d-block w-100" data-bs-interval="3000" alt="..." />
                        </div>
                        <div className="carousel-item active"  data-bs-interval="3000">
                            <img src={carousel2} className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item ">
                            <img src={carousel3} className="d-block w-100" data-bs-interval="3000" alt="..." />
                        </div>
                        <div className="carousel-item ">
                            <img src={carousel4} className="d-block w-100" data-bs-interval="3000" alt="..." />
                        </div>
                        <div className="carousel-item ">
                            <img src={carousel5} className="d-block w-100" data-bs-interval="3000" alt="..." />
                        </div>
                    </div>


                </div>

            </div>
        </>
    );
};

export default Hero;