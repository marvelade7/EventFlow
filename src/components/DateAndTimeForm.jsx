import React from 'react';

const DateAndTimeForm = () => {
    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{ padding: '2px 10px', backgroundColor: 'rgb(17,213,243)' }} className="m-0 rounded-5 text-white fw-semibold w-auto">2</p>
                <h5 className='m-0'>Date & Time</h5>
            </div>
            <div className="d-flex gap-3">
                <div className='form-group w-100'>
                    <label htmlFor="startDate">Start Date</label>
                    <input type="date" name="startDate" id="startDate" className='form-control shadow-none' />
                </div>
                <div className='form-group w-100'>
                    <label htmlFor="startTime">Start Time</label>
                    <input type="time" name="startTime" id="startTime" className='form-control shadow-none' />
                </div>
            </div>
            <div className="d-flex gap-3">
                <div className='form-group w-100'>
                    <label htmlFor="endDate">End Date</label>
                    <input type="date" name="endDate" id="endDate" className='form-control shadow-none' />
                </div>
                <div className='form-group w-100'>
                    <label htmlFor="endTime">Start Time</label>
                    <input type="time" name="endTime" id="endTime" className='form-control shadow-none' />
                </div>
            </div>
            <div className='form-group'>
                <label htmlFor="timeZone">Time Zone</label>
                <select name="timeZone" id="timeZone" className='form-control shadow-none'>
                    <option value="West African Time">West AFrican Time (WAT) -- UTC-5</option>
                    <option value="Eastern Time">Eastern Time (ET) -- UTC-5</option>
                    <option value="Pacific Time">Pacific Time (PT) -- UTC-8</option>
                    <option value="Central Time">Central Time (CT) -- UTC-6</option>
                    <option value="UTC">UTC</option>
                </select>
            </div>
        </div>
    );
};

export default DateAndTimeForm;