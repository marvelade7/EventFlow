import React from 'react';
import LeftPanel from '../components/LeftPanel';
import { Link } from 'react-router-dom';
import googleIcon from '../assets/images/google-icon.png';

const SignIn = () => {
    return (
        <div className='d-flex align-items-stretch h-100'>
            <LeftPanel style='fs-1 mt-5'
                head='Welcome Back'
                pStyle='fs-5'
                p='Access your exclusive dashboard, mange your premium tickets and explore the next wave of editorial experiences'
            // p='Your next great experience is waiting for you.'

            />
            <div style={{ backgroundColor: 'rgb(249,250,251)', padding: '4.6em 2em' }} className='w-50'>
                <div style={{ width: '450px' }} className='bg-white mx-auto py-5 px-4 shadow-sm rounded-3'>
                    <h4 className='fw-semibold'>Welcome Back</h4>
                    <p className='text-secondary'>Sign in to your EventFlow account</p>
                    <form action='login' method='post'>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input className='form-control shadow-none border-2' type="email" placeholder='alex@example.com' name='email' id='email' />
                        </div>
                        <div>
                            <div className='d-flex justify-content-between align-items-start mt-4'>
                                <label htmlFor="password">Password</label>
                                <p style={{ fontSize: '.9em' }} className="m-0 text-primary fw-semibold text-decoration-underline">Forgot Password?</p>
                            </div>
                            <input className='form-control shadow-none border-2' type="password" placeholder='Your password' name='password' id='password' />
                        </div>

                        <Link to='/dashboard'>
                            <button style={{ backgroundColor: 'rgb(226,131,8)' }} className='btn w-100 py-2 text-white fw-semibold my-3'>Sign In</button>
                        </Link>
                        <div className='d-flex align-items-center justify-content-between gap-3'>
                            <hr className='w-50' />
                            <p style={{ fontSize: '.9em' }} className="m-0">or</p>
                            <hr className='w-50' />
                        </div>

                        <btn className='btn d-flex align-items-center justify-content-center gap-3 rounded-3 border p-3 my-3  '>
                            {/* <i className='bi bi-google'></i> */}
                            <img src={googleIcon} width="30" />
                            <p className="m-0">Continue with Google</p>
                        </btn>

                        <p className="m-0 text-center">Don't have an account? <Link to='/signup'><span className='text-primary fw-semibold'>Sign Up</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;