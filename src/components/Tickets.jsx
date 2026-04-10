import React, { useState } from 'react';

const Tickets = () => {

    const [tickets, setTickets] = useState(10);
    const [price, setPrice] = useState(1);
    const [isFree, setIsFree] = useState(false);

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
                    <input checked={isFree} onChange={() => setIsFree(prev => !prev)} style={{ cursor: 'pointer' }} className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault"></input>
                </div>
            </div>

            <div className="d-flex gap-3 mt-4">
                <div className='form-group w-100'>
                    <label htmlFor="ticketPrice">Ticket Price</label>
                    <div className='form-control d-flex align-items-center shadow-none p-0 px-2'>
                        <i className='bi bi-currency-dollar'></i>
                        <input onChange={(e) => setPrice(Number(e.target.value))} disabled={isFree} type="number" min='1' name="ticketPrice" id="ticketPrice" className='border-0 py-2 w-100' style={{outline: 'none'}} value={price} />
                    </div>
                </div>
                <div className='form-group w-100'>
                    <label htmlFor="availableTickets">Total Tickets Available</label>
                    <div className='d-flex align-items-center justify-content-between px-0 py-0 gap-2 form-control shadow-none'>
                        <button style={{fontSize: '1.1em'}} onClick={() => setTickets(prev => (prev > 10 ? prev - 5 : 10))} className='border-0 py-1 px-3'>-</button>
                        <input onChange={(e) => {
                            const value = Number(e.target.value);
                            setTickets(value < 10 ? 10 : value);
                        }}
                            style={{ outline: 'none' }} type='number' value={tickets} className='border-0 text-center' />
                        <button style={{fontSize: '1.1em'}} onClick={() => setTickets(prev => prev + 5)} className='border-0 py-1 px-3'>+</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tickets;