import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
        <div style={{padding: '50px 20px'}} className='d-flex flex-column align-items-center justify-content-center gap-3 error-page'>
            <p style={{ fontSize: '7em', color: 'rgb(232,232,249)' }} className='fw-bold m-0'>404</p>
            <h2 className='m-0'>Ooops! This page took a wrong turn.</h2>
            <p className='fs-5 m-0 mt-3 mx-auto'>The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
            <div className='d-flex align-items-center justify-content-center gap-3 my-4'>
                <Link to='/' ><button style={{ backgroundColor: 'rgb(27,181,204)' }} className='btn text-white fw-semibold py-2 px-3 '>Go Back Home</button></Link>
                <button style={{ border: '2px solid rgb(27,181,204)', color: 'rgb(27,181,204)' }} className='btn fw-semibold py-2 px-3 '>Browse Events</button>
            </div>
            <div className='border d-inline-flex py-2 px-3 gap-2 rounded-3 align-items-center mb-4 shadow-sm bg-white'>
                <i className='bi bi-search'></i>
                <input style={{outline: 'none'}} type="text" placeholder='Search for events instead...' className='border-0 ' />
            </div>
            <div className='d-flex align-items-center gap-5 mt-5 justify-content-center'>
                <Link to='/' className='text-decoration-none'><p className='m-0 text-secondary fw-semibold error-link'>Home</p></Link>
                <p className='m-0 text-secondary fw-semibold error-link'>Browse Events</p>
                <p className='m-0 text-secondary fw-semibold error-link'>Support</p>
            </div>
        </div>
    );
};

export default Error404;