import React from 'react';

const GetTimeOfDay = () => {
        const hours = new Date().getHours();
        if (hours < 12) return "Morning";
        if (hours < 16) return "Afternoon";
        return "Evening";
    };

export default GetTimeOfDay;