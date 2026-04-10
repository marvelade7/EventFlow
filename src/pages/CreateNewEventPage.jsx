import React from 'react';
import Sidebar from '../components/Sidebar';
import CreateEventNav from '../components/CreateEventNav';

const CreateNewEventPage = () => {
    return (
        <div>
            <Sidebar />
            <div style={{ marginLeft: '300px', background: 'rgb(249,250,251)' }}>
                <CreateEventNav />
            </div>
        </div>
    );
};

export default CreateNewEventPage;