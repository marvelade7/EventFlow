import React from 'react';
import Sidebar from '../components/Sidebar';
import CreateEventNav from '../components/CreateEventNav';
import EventBasis from '../components/EventBasis';
import DateAndTimeForm from '../components/DateAndTimeForm';
import Location from '../components/Location';
import Tickets from '../components/Tickets';

const CreateNewEventPage = () => {
    return (
        <div>
            <Sidebar />
            <div style={{ marginLeft: '300px', background: 'rgb(249,250,251)' }}>
                <CreateEventNav />
                <div className='d-flex px-4 py-4'>
                    <div style={{width: '70%'}}>
                        <div className='my-4'>
                            <EventBasis />
                        </div>
                        <div className='my-4'>
                            <DateAndTimeForm />
                        </div>
                        <div className='my-4'>
                            <Location />
                        </div>
                        <div className='my-4'>
                            <Tickets />
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewEventPage;