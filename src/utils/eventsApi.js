import axios from "axios";
import { apiUrl } from "./apiConfig";

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

export const fetchDashboardStats = ({ token, signal } = {}) => {
    const headers = {
        Accept: "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return axios
        .get("https://eventflow-backend-fwv4.onrender.com/api/events/dashboard-stats", {
            signal,
            headers,
        })
        .then((res) => res.data);
};

export const fetchBookings = ({ token, signal, scope = "user" } = {}) => {
    const headers = {
        Accept: "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const path = scope === "organizer" ? "/bookings/my-event-bookings" : "/bookings/my-bookings";

    return axios
        .get(apiUrl(path), {
            signal,
            headers,
        })
        .then((res) => res.data);
};
