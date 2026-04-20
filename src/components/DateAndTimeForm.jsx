import React from 'react';

const DateAndTimeForm = ({ formik }) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const today = now.toISOString().split('T')[0];
    const hasError = (field) => (formik.touched[field] || formik.submitCount > 0) && formik.errors[field];

    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{ padding: '2px 10px', backgroundColor: 'rgb(17,213,243)' }} className="m-0 rounded-5 text-white fw-semibold w-auto">2</p>
                <h5 className='m-0'>Date & Time</h5>
            </div>
            <div className="d-flex gap-3">
                <div className='form-group w-100'>
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        className={`form-control shadow-none ${hasError('startDate') ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.startDate}
                        min={today}
                    />
                    {hasError('startDate') ? <div className='invalid-feedback d-block'>{formik.errors.startDate}</div> : null}
                </div>
                <div className='form-group w-100'>
                    <label htmlFor="startTime">Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        className={`form-control shadow-none ${hasError('startTime') ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.startTime}
                    />
                    {hasError('startTime') ? <div className='invalid-feedback d-block'>{formik.errors.startTime}</div> : null}
                </div>
            </div>
            <div className="d-flex gap-3">
                <div className='form-group w-100'>
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        className={`form-control shadow-none ${hasError('endDate') ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.endDate}
                        min={formik.values.startDate || today}
                    />
                    {hasError('endDate') ? <div className='invalid-feedback d-block'>{formik.errors.endDate}</div> : null}
                </div>
                <div className='form-group w-100'>
                    <label htmlFor="endTime">End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        id="endTime"
                        className={`form-control shadow-none ${hasError('endTime') ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.endTime}
                    />
                    {hasError('endTime') ? <div className='invalid-feedback d-block'>{formik.errors.endTime}</div> : null}
                </div>
            </div>
            <div className='form-group'>
                <label htmlFor="timeZone">Time Zone</label>
                <select
                    name="timeZone"
                    id="timeZone"
                    className={`form-control shadow-none ${hasError('timeZone') ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.timeZone}
                >
                    <option value="Africa/Lagos">Nigeria (WAT)</option>
                    <option value="Europe/London">United Kingdom (BST/GMT)</option>
                    <option value="America/New_York">US Eastern Time (ET)</option>
                    <option value="America/Los_Angeles">US Western Time (PT)</option>
                    <option value="Asia/Dubai">UAE (GST)</option>
                </select>
                {hasError('timeZone') ? <div className='invalid-feedback d-block'>{formik.errors.timeZone}</div> : null}
            </div>
        </div>
    );
};

export default DateAndTimeForm;
