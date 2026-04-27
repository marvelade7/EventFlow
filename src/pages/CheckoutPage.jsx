import React from 'react';
import CheckoutNav from '../components/CheckoutNav';

const CheckoutPage = () => {
    return (
        <div className='create-event-main checkout-page' style={{ marginLeft: '300px', background: 'rgb(249,250,251)', minHeight: '100vh' }} >
            <CheckoutNav />
            <div className='d-flex align-items-start gap-4 checkout-layout' style={{ margin: '40px auto', width: '60%' }}>
                <div className='d-flex flex-column gap-4 checkout-left' style={{ width: '60%' }}>
                    <div className='d-flex align-items-center gap-3 shadow-sm py-4 px-4 rounded-3 bg-white'>
                        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=80&fit=crop" alt="img" />
                        <div>
                            <h5 className='m-0'>Summer Beats Festival 2026</h5>
                            <p className="m-0">Aug 15, 2026 · 2:00 PM</p>
                            <p className="m-0">Madison Square Garden, NYC</p>
                        </div>
                    </div>
                    <div className='d-flex flex-column gap-3 shadow-sm py-4 px-4 rounded-3 bg-white'>
                        <h5>Select Tickets</h5>
                        <div className='d-flex align-items-center justify-content-between border rounded-3 py-3 px-3'>
                            <div>
                                <h6>General Admission</h6>
                                <p className=''>Access to all stages</p>
                                <p style={{color: 'rgb(223,127,7)'}} className='m-0 fs-5 fw-bold'>$49.00</p>
                            </div>
                            <div className='d-flex align-items-center gap-3'>
                                <button className='btn btn-light border-secondary fs-5 py-0 px-2 fw-semibold'>-</button>
                                <p className='m-0 fw-semibold'>1</p>
                                <button className='btn btn-light border-secondary fs-5 py-0 px-2 fw-semibold'>+</button>
                            </div>
                        </div>
                        
                        <div className='d-flex align-items-center justify-content-between border rounded-3 py-3 px-3'>
                            <div>
                                <h6>VIP Experience</h6>
                                <p className=''>Front row + back stage access</p>
                                <p style={{color: 'rgb(223,127,7)'}} className='m-0 fs-5 fw-bold'>$149.00</p>
                            </div>
                            <div className='d-flex align-items-center gap-3'>
                                <button className='btn btn-light border-secondary fs-5 py-0 px-2 fw-semibold'>-</button>
                                <p className='m-0 fw-semibold'>0</p>
                                <button className='btn btn-light border-secondary fs-5 py-0 px-2 fw-semibold'>+</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex flex-column gap-1 shadow-sm py-4 px-3 rounded-3 bg-white checkout-right' style={{width: '40%'}}>
                    <h5>Order Summary</h5>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0">General Admission x 2</p>
                        <p className="m-0 fw-semibold">$49.00</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0">Service fee</p>
                        <p className="m-0 fw-semibold">$4.90</p>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 fs-5 fw-semibold">Total</p>
                        <p style={{color: 'rgb(223,127,7)'}} className="m-0 fw-semibold fs-5">$4.90</p>
                    </div>
                    <button style={{backgroundColor: 'rgb(223,127,7)', fontSize: '1.1em'}} className='btn py-2 px-3 rounded-3 text-white fw-semibold mt-3' >Continue to Payment</button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
