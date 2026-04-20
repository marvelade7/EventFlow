import React from 'react';

const EventBasis = ({ formik }) => {
    const hasError = (field) => formik.touched[field] && formik.errors[field];

    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{padding: '2px 10px', backgroundColor: 'rgb(17,213,243)'}} className="m-0 rounded-5 text-white fw-semibold w-auto">1</p>
                <h5 className='m-0'>Event Basis</h5>
            </div>
            <div className='form-group'>
                <label htmlFor="eventName">Event Name</label>
                <input
                    type="text"
                    name="eventName"
                    id="eventName"
                    placeholder='Give your event a great name'
                    className={`form-control shadow-none ${hasError('eventName') ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.eventName}
                />
                {hasError('eventName') ? <div className='invalid-feedback d-block'>{formik.errors.eventName}</div> : null}
            </div>
            <div className='form-group'>
                <label htmlFor="category">Category</label>
                <select
                    name="category"
                    id="category"
                    className={`form-control shadow-none ${hasError('category') ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                >
                    <option value="" disabled>Select a category</option>
                    <option value="Music">Music</option>
                    <option value="Technology">Technology</option>
                    <option value="Sport">Sport</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Business">Business</option>
                </select>
                {hasError('category') ? <div className='invalid-feedback d-block'>{formik.errors.category}</div> : null}
            </div>
            <div className='form-group'>
                <label htmlFor="description">Short Description</label>
                <textarea
                    name="description"
                    id="description"
                    placeholder='A brief exciting, description of your event...'
                    className={`form-control shadow-none ${hasError('description') ? 'is-invalid' : ''}`}
                    rows='3'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                ></textarea>
                {hasError('description') ? <div className='invalid-feedback d-block'>{formik.errors.description}</div> : null}
            </div>
        </div>
    );
};

export default EventBasis;