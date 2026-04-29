import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import CreateEventNav from "../components/CreateEventNav";
import "./MyEvent.css";

const EVENTS_BY_USER_ENDPOINT = "https://eventflow-backend-fwv4.onrender.com/api/events/get-events-by-user";

const formatEventDate = (dateTime) => {
    if (!dateTime) return "N/A";

    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const getPriceLabel = (event) => {
    if (event?.isFree) return "Free";

    const prices = Array.isArray(event?.ticketTypes)
        ? event.ticketTypes
              .map((ticket) => Number(ticket?.ticketPrice ?? ticket?.price))
              .filter((price) => Number.isFinite(price))
        : [];

    if (prices.length === 0) return "TBD";

    const lowestPrice = Math.min(...prices);
    return `₦${lowestPrice.toLocaleString()}`;
};

const getStatusBadge = (status) => {
    const statusColors = {
        upcoming: "bg-info",
        ongoing: "bg-primary",
        completed: "bg-success",
        cancelled: "bg-danger",
    };

    return statusColors[status] || "bg-secondary";
};

const MyEvent = () => {
    const { sidebarOpen, toggleSidebar } = useOutletContext();
    const navigate = useNavigate();

    const [myEvents, setMyEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const controller = new AbortController();

        if (!token) {
            setIsLoading(false);
            setError("You need to sign in to view your events.");
            return () => controller.abort();
        }

        axios
            .get(EVENTS_BY_USER_ENDPOINT, {
                signal: controller.signal,
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                setMyEvents(Array.isArray(res.data?.events) ? res.data.events : []);
            })
            .catch((err) => {
                if (err.name !== "CanceledError") {
                    console.error("Error fetching events:", err);
                    setError("Unable to load your events. Please try again.");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => controller.abort();
    }, []);

    const handleEditEvent = (eventId) => {
        navigate(`/dashboard/edit-event/${eventId}`);
    };

    const handleViewDetails = (event) => {
        setSelectedEvent(event);
    };

    const handleDeleteEvent = (eventId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Authentication required");
            return;
        }

        axios
            .delete(`https://eventflow-backend-fwv4.onrender.com/api/events/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setMyEvents((prev) => prev.filter((event) => event._id !== eventId));
                setDeleteConfirm(null);
                alert("Event deleted successfully");
            })
            .catch((err) => {
                console.error("Error deleting event:", err);
                alert(err.response?.data?.message || "Failed to delete event");
            });
    };

    const handleManageSales = (eventId) => {
        navigate(`/dashboard/ticket-sales/${eventId}`);
    };

    return (
        <div
            className="create-event-main"
            style={{ marginLeft: "300px", background: "rgb(249,250,251)", minHeight: "100vh" }}
        >
            <CreateEventNav
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={sidebarOpen}
                title="My Events"
                actionLabel="Create New Event"
                onActionClick={() => navigate("/dashboard/create-event")}
            />

            <div className="px-4 pb-4 pt-4">
                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status" aria-hidden="true"></div>
                        <p className="mt-2 mb-0 text-secondary fw-semibold">Loading your events...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-warning mb-0 d-flex align-items-center gap-2" role="alert">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                ) : myEvents.length === 0 ? (
                    <div className="text-center py-5 border rounded-4 bg-light">
                        <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                        <h6 className="mt-3 mb-1">No events yet</h6>
                        <p className="text-secondary mb-3">
                            You haven't created any events yet. Create your first event to get started.
                        </p>
                        <button className="btn btn-info text-white" onClick={() => navigate("/dashboard/create-event") }>
                            Create Event
                        </button>
                    </div>
                ) : (
                    <div className="my-events-table-wrapper">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Event Title</th>
                                    <th>Category</th>
                                    <th>Start Date</th>
                                    <th>Status</th>
                                    <th>Ticket Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myEvents.map((event) => (
                                    <tr key={event?._id}>
                                        <td className="fw-semibold">{event?.title || "Untitled"}</td>
                                        <td>{event?.category || "N/A"}</td>
                                        <td>{formatEventDate(event?.startDateTime)}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(event?.status)}`}>
                                                {event?.status || "upcoming"}
                                            </span>
                                        </td>
                                        <td>{getPriceLabel(event)}</td>
                                        <td>
                                            <div className="btn-group btn-group-sm" role="group">
                                                <button
                                                    className="btn btn-outline-info"
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(event)}
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary"
                                                    title="Edit Event"
                                                    onClick={() => handleEditEvent(event._id)}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-success"
                                                    title="Manage Ticket Sales"
                                                    onClick={() => handleManageSales(event._id)}
                                                >
                                                    <i className="bi bi-graph-up"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    title="Delete Event"
                                                    onClick={() => setDeleteConfirm(event._id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {deleteConfirm ? (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h5 className="mb-3">Delete Event?</h5>
                                <p className="text-secondary mb-0">
                                    Are you sure you want to delete this event? This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setDeleteConfirm(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDeleteEvent(deleteConfirm)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {selectedEvent ? (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Event Details</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedEvent(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <p className="text-secondary mb-1">Title</p>
                                        <h6 className="mb-0">{selectedEvent?.title}</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-secondary mb-1">Category</p>
                                        <h6 className="mb-0">{selectedEvent?.category}</h6>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p className="text-secondary mb-1">Description</p>
                                    <p className="mb-0">{selectedEvent?.description}</p>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <p className="text-secondary mb-1">Start Date</p>
                                        <h6 className="mb-0">{formatEventDate(selectedEvent?.startDateTime)}</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-secondary mb-1">End Date</p>
                                        <h6 className="mb-0">{formatEventDate(selectedEvent?.endDateTime)}</h6>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p className="text-secondary mb-1">Location</p>
                                    <h6 className="mb-0">
                                        {selectedEvent?.location?.venue}, {selectedEvent?.location?.city}, {selectedEvent?.location?.country}
                                    </h6>
                                </div>
                                {Array.isArray(selectedEvent?.ticketTypes) && selectedEvent.ticketTypes.length > 0 ? (
                                    <div className="mb-3">
                                        <p className="text-secondary mb-2">Ticket Types</p>
                                        {selectedEvent.ticketTypes.map((ticket, index) => (
                                            <div key={`${ticket?.name || "ticket"}-${index}`} className="border rounded-2 p-2 mb-2 d-flex justify-content-between">
                                                <span>
                                                    {ticket?.name || "Ticket"} - ₦{Number((ticket?.ticketPrice ?? ticket?.price) || 0).toLocaleString()}
                                                </span>
                                                <small className="text-secondary">{ticket?.quantity || 0} available</small>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-light" onClick={() => setSelectedEvent(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default MyEvent;
