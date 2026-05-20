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

    // backend provides dashboard stats from bookings router
    const url = apiUrl(`/bookings/dashboard-stats`);
    console.log('fetching dashboard stats from:', url);

    return axios
        .get(url, {
            signal,
            headers,
        })
        .then((res) => {
            console.log(res);
            const data = res.data || {};
            console.log('Up coming events: ' + data.upcomingEventCount);
            console.log('Active tickets: ' + data.activeTicketCount);
            console.log('Attended events: ' + data.attendedEventCount);
            // normalize to shapes expected by frontend
            return {
                totalEvents: Number(data?.upcomingEventCount || data?.totalEvents || 0),
                activeTickets: Number(data?.activeTicketCount || data?.activeTickets || 0),
                eventsAttended: Number(data?.attendedEventCount || data?.eventsAttended || 0),
                // include raw arrays in case UI needs them later
                upcomingEvents: Array.isArray(data?.upcomingEvents) ? data.upcomingEvents : [],
                activeTicketsList: Array.isArray(data?.activeTickets) ? data.activeTickets : [],
                attendedEvents: Array.isArray(data?.attendedEvents) ? data.attendedEvents : [],
            };
        });
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
