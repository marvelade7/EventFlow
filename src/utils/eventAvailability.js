export const getTicketTypes = (event) => {
    return Array.isArray(event?.ticketTypes) ? event.ticketTypes : [];
};

export const isEventSoldOut = (event) => {
    const tickets = getTicketTypes(event);
    if (!tickets.length) return false;

    return tickets.every((ticket) => {
        const quantity = Number(ticket?.quantity || 0);
        const sold = Number(ticket?.sold || 0);
        return quantity - sold <= 0;
    });
};
