import React from 'react';

const EventBasis = () => {
    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{padding: '2px 10px', backgroundColor: 'rgb(17,213,243)'}} className="m-0 rounded-5 text-white fw-semibold w-auto">1</p>
                <h5 className='m-0'>Event Basis</h5>
            </div>
            <div className='form-group'>
                <label htmlFor="eventName">Event Name</label>
                <input type="text" name="eventName" id="eventName" placeholder='Give your event a great name' className='form-control shadow-none' />
            </div>
            <div className='form-group'>
                <label htmlFor="category">Category</label>
                <select name="category" id="category" className='form-control shadow-none'>
                    <option value="" selected disabled>Select a category</option>
                    <option value="Music">Music</option>
                    <option value="Technology">Technology</option>
                    <option value="Sport">Sport</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Business">Business</option>
                </select>
            </div>
            <div className='form-group'>
                <label htmlFor="description">Short Description</label>
                <textarea name="description" id="description" placeholder='A brief exciting, description of your event...' className='form-control shadow-none' rows='3'></textarea>
            </div>
        </div>
    );
};

export default EventBasis;