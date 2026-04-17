import React, { useEffect } from 'react';
import aos from "aos";
import "aos/dist/aos.css";

const BrowseEventsFilter = ({filterEvent}) => {
    useEffect(() => {
        aos.init({ 
            duration: 1500,
            once: true, 
        });
    }, []);

    return (
        <div>
            <div className='d-flex align-items-center gap-3 my-4'>
                <p data-aos="fade-right" style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>All</p>
                <p data-aos="fade-up" style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Music</p>
                <p data-aos="fade-up" style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Tech</p>
                <p data-aos="fade-up" style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Sports</p>
                <p data-aos="fade-up" style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Arts</p>
                <p data-aos="fade-left" style={filterEvent} className='btn m-0 rounded-4 px-4 py-1'>Foods</p>
            </div>
        </div>
    );
};

export default BrowseEventsFilter;