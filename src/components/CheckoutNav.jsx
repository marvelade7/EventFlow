import React from 'react';
import Logo from './Logo';

const CheckoutNav = () => {
    return (
        <div style={{gap: '200px'}} className='d-flex align-items-center justify-content-center bg-white py-3 shadow-sm'>
            <Logo size='40px' fontSize='1.2em' />
            <div style={{gap: '50px'}} className='d-flex align-items-center'>
                <div className='d-flex align-items-center gap-3'>
                    <p style={{ padding: '2px 10px', backgroundColor: 'rgb(17,213,243)' }} className="border m-0 rounded-5 text-white fw-semibold w-auto">1</p>
                    <p style={{ fontSize: '.9em', color: 'rgb(17,213,243)' }} className='m-0 fw-semibold'>Sell Tickets</p>
                </div>
                <div className='d-flex align-items-center gap-3 text-secondary'>
                    <p style={{ padding: '2px 10px' }} className="border border-secondary m-0 rounded-5 fw-semibold w-auto">2</p>
                    <p style={{ fontSize: '.9em' }} className='m-0 fw-semibold'>Payment</p>
                </div>
                <div className='d-flex align-items-center gap-3 text-secondary'>
                    <p style={{ padding: '2px 10px' }} className="border border-secondary m-0 rounded-5 fw-semibold w-auto">3</p>
                    <p style={{ fontSize: '.9em' }} className='m-0 fw-semibold'>Confirmation</p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutNav;