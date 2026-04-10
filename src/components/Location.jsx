import React from 'react';
import Map from './Map';

const Location = () => {
    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{ padding: '2px 10px', backgroundColor: 'rgb(17,213,243)' }} className="m-0 rounded-5 text-white fw-semibold w-auto">3</p>
                <h5 className='m-0'>Location</h5>
            </div>
            <div className='form-group'>
                <label htmlFor="venueName">Venue Name</label>
                <input type="text" name="venueName" id="venueName" placeholder='e.g Madison Square Garden' className='form-control shadow-none' />
            </div>
            <div className='form-group w-100'>
                <label htmlFor="address">Address</label>
                <input type="text" name="address" id="address" placeholder='Street Address' className='form-control shadow-none' />
            </div>
            <div className='d-flex gap-3'>
                <div className='form-group w-100'>
                    <input type="text" name="city" id="city" placeholder='City' className='form-control shadow-none' />
                </div>
                <div className='form-group w-100'>
                    <input type="text" name="state" id="state" placeholder='State' className='form-control shadow-none' />
                </div>
                <div className='form-group w-100'>
                    <input type="text" name="country" id="country" placeholder='Country' className='form-control shadow-none' />
                </div>
            </div>
            <div className='mt-3'>
                <Map/>
            </div>
        </div>
    );
};

export default Location;