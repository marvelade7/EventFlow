import React from 'react';
import LeftPanel from '../components/LeftPanel';
import '../components/Auth.css';
import { Link } from 'react-router-dom';
import googleIcon from '../assets/images/google-icon.png';

const SignUp = () => {
    return (
        <div>
            <div className='d-flex align-items-stretch'>
                <LeftPanel head='EventFlow Join the community of event lovers'
                    p='Discover, book, and experience events like never before.'
                    texthead='Why Choose EventFlow for your event ticketing?'
                    text1='Simple, easy to use platform'
                    text2='Lowest ticketing fees'
                    text3='Dedicated customer support team'
                    text4='Powerful features'

                />
                <div style={{ backgroundColor: 'rgb(249,250,251)', padding: '2em' }} className='w-50'>
                    <div style={{ width: '450px' }} className='bg-white mx-auto py-5 px-4 shadow-sm rounded-3'>
                        <h4 className='fw-semibold'>Create Your Account</h4>
                        <p className='text-secondary'>Join thousands of event lovers</p>
                        <form action='register' method='post'>
                            <div>
                                <label htmlFor="name">Full Name</label>
                                <input className='form-control shadow-none border-2' type="text" placeholder='Alex Johnson' name='name' id='name' />
                            </div>
                            <div>
                                <label htmlFor="email">Email Address</label>
                                <input className='form-control shadow-none border-2' type="email" placeholder='alex@example.com' name='email' id='email' />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input className='form-control shadow-none border-2' type="password" placeholder='Create a strong password' name='password' id='password' />
                            </div>
                            <div>
                                <label htmlFor="confimPassword">Confirm Password</label>
                                <input className='form-control shadow-none border-2' type="password" placeholder='Confirm password' name='confirmPassword' id='confirmPassword' />
                            </div>

                            <div className='d-flex align-items-center justify-content-start gap-2 my-4'>
                                <input type="checkbox" name="terms" id='terms' />
                                <label htmlFor='terms' className="m-0">I agree to the <span className='text-primary'>Terms of Service</span> and <span className='text-primary'>Privacy Policy</span></label>
                            </div>

                            <Link to='/signin'>
                                <button style={{ backgroundColor: 'rgb(226,131,8)' }} className='btn w-100 py-2 text-white fw-semibold mb-3'>Create Account</button>
                            </Link>
                            <div className='d-flex align-items-center justify-content-between'>
                                <hr className='w-25' />
                                <p style={{ fontSize: '.9em' }} className="m-0">or continue with</p>
                                <hr className='w-25' />
                            </div>

                            <btn className='btn d-flex align-items-center justify-content-center gap-3 rounded-3 border p-3 my-3  '>
                                {/* <i className='bi bi-google'></i> */}
                                <img src={googleIcon} width="30" />
                                <p className="m-0">Continue with Google</p>
                            </btn>

                            <p className="m-0 text-center">Already have an account? <Link to='/signin'><span className='text-primary fw-semibold'>Sign In</span></Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;