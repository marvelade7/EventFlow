import React from 'react';

const Tickets = ({ formik }) => {
    const hasError = (field) => formik.touched[field] && formik.errors[field];

    const handleTicketChange = (value) => {
        const parsed = Number(value);
        formik.setFieldTouched('availableTickets', true, false);
        formik.setFieldValue('availableTickets', Number.isNaN(parsed) ? 10 : Math.max(10, parsed));
    };

    const handlePriceChange = (value) => {
        const parsed = Number(value);
        formik.setFieldTouched('ticketPrice', true, false);
        formik.setFieldValue('ticketPrice', Number.isNaN(parsed) ? '' : Math.max(0, parsed));
    };

    return (
        <div className='bg-white rounded-4 py-4 px-4 shadow-sm'>
            <div className='d-flex gap-3 align-items-center mb-4'>
                <p style={{ padding: '2px 10px', backgroundColor: 'rgb(17,213,243)' }} className="m-0 rounded-5 text-white fw-semibold w-auto">4</p>
                <h5 className='m-0'>Tickets</h5>
            </div>
            <div style={{ background: 'rgba(0,0,0,.05)' }} className='d-flex align-items-center justify-content-between rounded-3 py-2 px-3 w-100'>
                <div>
                    <h6 className='m-0'>Free Event</h6>
                    <p className="m-0">Toggle to make this a free event</p>
                </div>
                <div className="form-check form-switch">
                    <input
                        checked={formik.values.isFree}
                        onChange={() => {
                            const next = !formik.values.isFree;
                            formik.setFieldValue('isFree', next);
                            if (next) {
                                formik.setFieldValue('ticketPrice', 1);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switchCheckDefault"
                    ></input>
                </div>
            </div>

            <div className="d-flex align-items-start gap-3 mt-4">
                <div className='form-group w-100'>
                    <label htmlFor="ticketPrice">Ticket Price</label>
                    <div className={`form-control d-flex align-items-center shadow-none p-0 px-2 ${hasError('ticketPrice') ? 'is-invalid' : ''}`}>
                        <i className='bi bi-currency-dollar'></i>
                        <input
                            onChange={(e) => handlePriceChange(e.target.value)}
                            onBlur={formik.handleBlur}
                            disabled={formik.values.isFree}
                            type="number"
                            min='1'
                            name="ticketPrice"
                            id="ticketPrice"
                            className='border-0 py-2 w-100'
                            style={{outline: 'none'}}
                            value={formik.values.ticketPrice}
                        />
                    </div>
                    {hasError('ticketPrice') ? <div className='invalid-feedback d-block'>{formik.errors.ticketPrice}</div> : null}
                </div>
                <div className='form-group w-100'>
                    <label htmlFor="availableTickets">Total Tickets Available <span className='text-secondary'>(min - 10)</span></label>
                    <div className='d-flex align-items-center justify-content-between px-0 py-0 gap-2 form-control shadow-none ticket-quantity-control'>
                        <button
                            style={{fontSize: '1.3em'}}
                            onClick={() => handleTicketChange(formik.values.availableTickets - 5)}
                            className='border-0 py-2 px-3 qty-btn'
                            type='button'
                        >
                            -
                        </button>
                        <input
                            onChange={(e) => handleTicketChange(e.target.value)}
                            onBlur={formik.handleBlur}
                            style={{ outline: 'none' }}
                            type='number'
                            name='availableTickets'
                            id='availableTickets'
                            value={formik.values.availableTickets}
                            className='border-0 text-center qty-input'
                        />
                        <button
                            style={{fontSize: '1.3em'}}
                            onClick={() => handleTicketChange(formik.values.availableTickets + 5)}
                            className='border-0 py-2 px-3 qty-btn'
                            type='button'
                        >
                            +
                        </button>
                    </div>
                    {hasError('availableTickets') ? <div className='invalid-feedback d-block'>{formik.errors.availableTickets}</div> : null}
                </div>
            </div>
        </div>
    );
};

export default Tickets;