import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
// import logo from '../assets/images/logo.png'

const Navbar = ({scrollToBrowse, scrollToContact, scrollToHero, scrollToWorks}) => {
    const navigate = useNavigate();

    const nav = {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'transparent'
    };

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    const defaultStyle = {
        color: ' black',
        border: '1px solid black',
        backgroundColor: 'transparent'
    };
    const hoverStyle = {
        color: 'white',
        backgroundColor: 'black',
        border: '1px solid black'
    };

    const handleNavAction = (action) => {
        if (typeof action === 'function') {
            action();
            return;
        }

        // Fallback for pages that render Navbar without Home scroll callbacks.
        navigate('/');
    };

    const currentStyle = isHovered ? { ...defaultStyle, ...hoverStyle } : { ...defaultStyle };
    return (
        <>
            <nav id='navbar' style={nav} className="navbar navbar-expand-lg bg-body-tertiary py-2 px-5 shadow-sm ">
                <div className="container-fluid">
                    <Logo size={50} fontSize='1.4em'/>
                    <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto mb-3 gap-3 mb-lg-0">
                            <li className="nav-item">
                                <button onClick={() => handleNavAction(scrollToHero)} type='button' className="nav-link active" aria-current="page">Home</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => handleNavAction(scrollToBrowse)} type='button' className="nav-link active">Browse Events</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => handleNavAction(scrollToWorks)} type='button' className="nav-link active">How It Works</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => handleNavAction(scrollToContact)} type='button' className="nav-link active">Contact</button>
                            </li>
                        </ul>
                        <div className="d-flex gap-3 align-items-center" role="search">
                            <div className="d-flex align-items-center gap-2 me-2">
                                <Link to="/privacy-policy" className="nav-link small">Privacy</Link>
                                <Link to="/terms-and-conditions" className="nav-link small">Terms</Link>
                            </div>
                            <Link to='/signin'><button style={currentStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='btn px-3'>Sign In</button></Link>
                            <Link to='/signup'><button className="btn btn-warning px-3 fw-semibold " type="button">Get Started</button></Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;