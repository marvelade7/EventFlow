import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
// import logo from '../assets/images/logo.png'

const Navbar = ({scrollToBrowse, scrollToContact, scrollToHero, scrollToWorks}) => {
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
                            <li onClick={scrollToHero} className="nav-item">
                                <button className="nav-link active" aria-current="page" href="#">Home</button>
                            </li>
                            <li onClick={scrollToBrowse} className="nav-item">
                                <button className="nav-link active" href="#">Browse Events</button>
                            </li>
                            <li onClick={scrollToWorks} className="nav-item">
                                <button className="nav-link active" href="#">How It Works</button>
                            </li>
                            <li onClick={scrollToContact} className="nav-item">
                                <button className="nav-link active" href="#">Contact</button>
                            </li>
                        </ul>
                        <div className="d-flex gap-3" role="search">
                            <Link to='signin'><button style={currentStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='btn px-3'>Sign In</button></Link>
                            <Link to='signup'><button className="btn btn-warning px-3 " type="submit">Get Started</button></Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;