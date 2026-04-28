import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import aos from "aos";
import "aos/dist/aos.css";

const LeftPanel = ({ head, p, texthead, text1, text2, text3, text4, style, pStyle }) => {
    useEffect(() => {
        aos.init({ 
            duration: 1500,
            once: true, 
        });
    }, []);

    const leftPanel = {
        background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/authImg.png)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        color: 'white',
        padding: '4em',
        // height: '100vh',
        width: '50vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '4em',
        alignItems: 'start',
        justifyContent: 'start',
        height: '100vh',

    };

    return (
        <>
            <div data-aos="fade-right" style={leftPanel}>
                <Link to='/' style={{textDecoration: 'none', color: 'white'}}>
                    <div className='d-flex align-items-center gap-1 top-0'>
                        <img src="/eventLogo.png" width="40" />
                        <h5 className='m-0'>EventFlow</h5>
                    </div>
                </Link>
                <div data-aos="fade-right">
                    <h3 className={style}>{head}</h3>
                    <p className={pStyle}>{p}</p>
                    <div className='mt-5'>
                        <p className='fs-4'>{texthead}</p>
                        <ul style={{ listStyle: 'none' }}>
                            <li>{text1}</li>
                            <li>{text2}</li>
                            <li>{text3}</li>
                            <li>{text4}</li>
                        </ul>
                    </div>
                </div>
                <div data-aos="fade-up" className='card py-3 px-4 text-white fadeAndSlide' style={{ backgroundColor: 'rgba(255, 255, 255, 0.22)', border: 'none' }}>
                    <p className='m-0'>"EventFlow made it so easy to discover and book events. I've attended 12 events this year alone!"</p>
                    <div className='d-flex align-items-center gap-3 mt-1'>
                        <img src="https://randomuser.me/api/portraits/women/68.jpg" width="50" className='rounded-circle shadow-sm' />
                        <div>
                            <p className='m-0'>Alex Johnson</p>
                            <p className='m-0'>Event Enthusiast</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftPanel;