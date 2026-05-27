export const getEventLink = (eventId) => {
    if (!eventId) return "";

    return `${window.location.origin}/get-events/${eventId}`;
};
