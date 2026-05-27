import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getEventLink } from "../utils/eventLink";
import "./EventDetails.css";

const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatDateTime = (dateTime) => {
    if (!dateTime) return "Date TBD";

    const parsed = new Date(dateTime);
    if (Number.isNaN(parsed.getTime())) return "Date TBD";

    return parsed.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const getHostName = (event) => {
    const host = event?.createdBy;
    const name = [host?.firstName, host?.lastName].filter(Boolean).join(" ");
    return name || "Event host";
};

const getLocation = (event) => {
    const location = event?.location || {};
    const parts = [
        location.venue || event?.venue,
        location.address || event?.address,
        location.city || event?.city,
        location.state || event?.state,
        location.country || event?.country,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "Venue TBD";
};

const getTicketTypes = (event) => {
    return Array.isArray(event?.ticketTypes) ? event.ticketTypes : [];
};

const getTicketPrice = (ticket) => {
    const price = Number(ticket?.ticketPrice ?? ticket?.price);
    return Number.isFinite(price) ? price : 0;
};

const getTicketRemaining = (ticket) => {
    const quantity = Number(ticket?.quantity);
    const sold = Number(ticket?.sold || 0);

    if (!Number.isFinite(quantity)) return "Available";

    return Math.max(quantity - sold, 0);
};

const isEventSoldOut = (event) => {
    const tickets = getTicketTypes(event);
    if (!tickets.length) return false;

    return tickets.every((ticket) => {
        const remaining = getTicketRemaining(ticket);
        return remaining !== "Available" && remaining <= 0;
    });
};

const EventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError("");

        axios
            .get(
                `https://eventflow-backend-fwv4.onrender.com/api/events/get-events/${eventId}`,
            )
            .then((res) => {
                setEvent(res.data.event);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load event details right now.");
                setLoading(false);
            });
    }, [eventId]);

    const ticketTypes = useMemo(() => getTicketTypes(event), [event]);

    const eventPrice = useMemo(() => {
        if (event?.isFree === true || event?.isFree === "true") return "Free";

        const prices = ticketTypes
            .map((ticket) => getTicketPrice(ticket))
            .filter((price) => Number.isFinite(price));

        if (!prices.length) return "Price TBD";
        return formatMoney(Math.min(...prices));
    }, [event, ticketTypes]);

    const totalRemaining = useMemo(() => {
        if (!ticketTypes.length) return "Available";

        const finiteRemaining = ticketTypes
            .map((ticket) => getTicketRemaining(ticket))
            .filter((remaining) => Number.isFinite(remaining));

        if (!finiteRemaining.length) return "Available";
        return finiteRemaining.reduce((total, value) => total + value, 0);
    }, [ticketTypes]);

    const handleBookNow = () => {
        if (!event || isEventSoldOut(event)) return;

        const token = localStorage.getItem("token");
        if (!token) {
            // Save event so they return to it after sign in
            localStorage.setItem("pendingBookingEvent", JSON.stringify(event));
            navigate("/signup");
        } else {
            navigate("/dashboard/checkout", { state: { event } });
        }
    };

    const handleCopyLink = async () => {
        if (!event?._id) return;

        try {
            await navigator.clipboard.writeText(getEventLink(event._id));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch (copyError) {
            console.error("Failed to copy event link:", copyError);
        }
    };

    if (loading) {
        return (
            <div className="event-details-page">
                <Navbar />
                <section className="event-details-hero">
                    <div className="event-details-shell text-center py-5">
                        <div className="spinner-border text-info" role="status"></div>
                        <p className="mt-3 mb-0 text-secondary fw-semibold">
                            Loading event details...
                        </p>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="event-details-page">
                <Navbar />
                <section className="event-details-hero">
                    <div className="event-details-shell text-center py-5">
                        <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                        <h4 className="mt-3 mb-2">Event not found</h4>
                        <p className="text-secondary mb-4">
                            {error || "This event may have been removed."}
                        </p>
                        <button
                            type="button"
                            className="btn btn-warning fw-semibold px-4"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </button>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="event-details-page">
            <Navbar />

            <section className="event-details-hero">
                <div className="event-details-shell">
                    <div className="event-details-card">
                        <img
                            src={
                                event?.bannerImage ||
                                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=800&fit=crop"
                            }
                            alt={event?.title || "Event banner"}
                            className="event-details-banner"
                        />

                        <div className="event-details-body">
                            <div className="event-details-top-row">
                                <span className="event-category-badge">
                                    <i className="bi bi-tag-fill"></i>
                                    {event?.category || "Event"}
                                </span>
                                <span className="event-status-pill text-capitalize">
                                    {event?.status || "upcoming"}
                                </span>
                            </div>

                            <h1 className="event-details-title">
                                {event?.title || "Untitled Event"}
                            </h1>

                            <p className="event-details-description">
                                {event?.description ||
                                    "No description has been provided for this event."}
                            </p>

                            <div className="event-meta-grid">
                                <div className="event-meta-item">
                                    <p>Date and time</p>
                                    <h6>
                                        <i className="bi bi-calendar-event"></i>
                                        {formatDateTime(event?.startDateTime)}
                                    </h6>
                                </div>
                                <div className="event-meta-item">
                                    <p>Venue / Location</p>
                                    <h6>
                                        <i className="bi bi-geo-alt-fill"></i>
                                        {getLocation(event)}
                                    </h6>
                                </div>
                                <div className="event-meta-item">
                                    <p>Event price</p>
                                    <h6>
                                        <i className="bi bi-cash-coin"></i>
                                        {eventPrice}
                                    </h6>
                                </div>
                                <div className="event-meta-item">
                                    <p>Spots remaining</p>
                                    <h6>
                                        <i className="bi bi-people-fill"></i>
                                        {totalRemaining === "Available"
                                            ? "Available"
                                            : `${totalRemaining} left`}
                                    </h6>
                                </div>
                            </div>

                            <div className="event-host-card">
                                {event?.createdBy?.profilePic ? (
                                    <img
                                        src={event.createdBy.profilePic}
                                        alt={getHostName(event)}
                                        className="event-host-avatar"
                                    />
                                ) : (
                                    <span className="event-host-fallback">
                                        {getHostName(event).charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <div>
                                    <p className="m-0 text-secondary">Hosted by</p>
                                    <h6 className="m-0">{getHostName(event)}</h6>
                                </div>
                            </div>

                            <div className="event-ticket-section">
                                <h5 className="mb-3">Ticket types and prices</h5>
                                {ticketTypes.length > 0 ? (
                                    <div className="event-ticket-list">
                                        {ticketTypes.map((ticket, index) => {
                                            const remaining = getTicketRemaining(ticket);

                                            return (
                                                <div
                                                    key={`${ticket?.name || "ticket"}-${index}`}
                                                    className="event-ticket-item"
                                                >
                                                    <div>
                                                        <h6 className="mb-1">
                                                            {ticket?.name ||
                                                                "General Admission"}
                                                        </h6>
                                                        <p className="m-0 text-secondary">
                                                            {remaining === "Available"
                                                                ? "Available"
                                                                : `${remaining} spots left`}
                                                        </p>
                                                    </div>
                                                    <strong>
                                                        {event?.isFree === true ||
                                                        event?.isFree === "true"
                                                            ? "Free"
                                                            : formatMoney(
                                                                  getTicketPrice(
                                                                      ticket,
                                                                  ),
                                                              )}
                                                    </strong>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="event-ticket-item">
                                        <div>
                                            <h6 className="mb-1">General Admission</h6>
                                            <p className="m-0 text-secondary">
                                                Ticket details will be updated by the host.
                                            </p>
                                        </div>
                                        <strong>
                                            {event?.isFree === true ||
                                            event?.isFree === "true"
                                                ? "Free"
                                                : eventPrice}
                                        </strong>
                                    </div>
                                )}
                            </div>

                            <div className="event-actions-row">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark px-4 py-2 fw-semibold"
                                    onClick={handleCopyLink}
                                >
                                    <i className="bi bi-link-45deg me-1"></i>
                                    {copied ? "Copied" : "Copy link"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBookNow}
                                    disabled={isEventSoldOut(event)}
                                    className="btn event-book-btn text-white fw-semibold px-4 py-2"
                                >
                                    {isEventSoldOut(event) ? "Sold Out" : "Book Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer onSubscribe={() => navigate("/signup")} />
        </div>
    );
};

export default EventDetails;