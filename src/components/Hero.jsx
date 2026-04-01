import React from 'react';
import carousel1 from '../assets/images/carousel1.png';
import carousel2 from '../assets/images/carousel2.png';
import carousel3 from '../assets/images/carousel3.png';
import carousel4 from '../assets/images/carousel4.png';
import carousel5 from '../assets/images/carousel5.png';
import Navbar from './Navbar';

const Hero = () => {
    return (
        <>
            <div>
                <div id="carouselExampleSlidesOnly" className="carousel slide text-white" data-bs-ride="carousel">
                {/* <Navbar /> */}
                    <div className="carousel-fixed-content d-flex flex-column align-items-center justify-content-center">
                        <h2 style={{ fontSize: '3em' }} className='fw-bold m-0 text'>Discover Events. Book Instantly.</h2>
                        <h2 className='fw-bold m-0 text' style={{ color: 'rgb(255, 202, 44)', fontSize: '3em' }}>Experience More.</h2>
                        <p className='w-50 fs-5 m-0 my-4 text'>The all-in-one platform for discovering unforgettable events and managing tickets effortlessly. From concerts to conferences — your next experience is one click away.</p>
                        <div className='mt-3 d-flex align-items-center gap-4'>
                            <button style={{fontSize: '1.1em'}} className='btn btn-warning text-dark px-4 w-auto py-2 fw-semibold '>Browse Events</button>
                            <button style={{fontSize: '1.1em'}} className='btn btn-outline-light px-4 w-auto py-2 fw-semibold '>Create an event</button>
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