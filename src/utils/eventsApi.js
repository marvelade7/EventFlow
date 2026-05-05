import axios from "axios";

export const EVENTS_ENDPOINT =
    "https://eventflow-backend-fwv4.onrender.com/api/events/get-events";

export const extractEventsFromResponse = (data) => {
    if (Array.isArray(data?.events)) return data.events;
    return [];
};

export const fetchEvents = ({ token, signal } = {}) => {
    const headers = {
        Accept: "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return axios
        .get(EVENTS_ENDPOINT, {
            signal,
            headers,
        })
        .then((res) => extractEventsFromResponse(res.data));
};
