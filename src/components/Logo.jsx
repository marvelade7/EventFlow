import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({size = 50, fontSize = '1.4em'}) => {
    return (
        <div>
            <Link to='/' className='text-decoration-none'>
                <p style={{ fontSize: fontSize }} className='navbar-brand d-flex align-items-center m-0 fw-semibold gap-1 text-black'><img src='/eventLogo.png' className='nav-logo' style={{width: size}} />Event<span style={{ color: 'rgb(17, 213, 243)' }}>Flow</span></p>
            </Link>
        </div>
    );
};

export default Logo;