import React, { useEffect, useState } from "react";
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

const getEventTicketPrice = (event) => {
    const firstTicket = Array.isArray(event?.ticketTypes)
        ? event.ticketTypes.find((ticket) => Number.isFinite(Number(ticket?.ticketPrice ?? ticket?.price)))
        : null;

    if (!firstTicket) return "";

    return String(Number(firstTicket?.ticketPrice ?? firstTicket?.price));
};

const getDateInputValue = (dateTime) => {
    if (!dateTime) return "";

    const value = String(dateTime).trim();
    const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
    if (match) return match[1];

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    return parsed.toISOString().slice(0, 10);
};

const getTimeInputValue = (dateTime) => {
    if (!dateTime) return "";

    const value = String(dateTime).trim();
    const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
    if (match) return match[2];

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    return parsed.toISOString().slice(11, 16);
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
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

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

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setEditFormData({
            title: event?.title || "",
            category: event?.category || "",
            description: event?.description || "",
            isFree: event?.isFree || false,
            startDate: getDateInputValue(event?.startDateTime),
            startTime: getTimeInputValue(event?.startDateTime),
            endDate: getDateInputValue(event?.endDateTime),
            endTime: getTimeInputValue(event?.endDateTime),
            ticketPrice: getEventTicketPrice(event),
            bannerImage: event?.bannerImage || event?.banner || "",
            bannerFile: null,
            venue: event?.location?.venue || event?.venue || "",
            city: event?.location?.city || event?.city || "",
            state: event?.location?.state || event?.state || "",
            country: event?.location?.country || event?.country || "",
            address: event?.location?.address || event?.address || "",
        });
    };

    const handleEditFormChange = (field, value) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleBannerChange = (file) => {
        setEditFormData((prev) => ({
            ...prev,
            bannerFile: file || null,
        }));
    };

    const handleSaveEvent = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            showNotification("Authentication required", "error");
            return;
        }

        // Event ID validation
        const eventId = editingEvent?._id || editingEvent?.id;
        console.log("[MyEvent] EditingEvent:", editingEvent);
        console.log("[MyEvent] Event ID Check - _id:", editingEvent?._id, "id:", editingEvent?.id, "Final ID:", eventId);

        if (!eventId) {
            showNotification("Error: Event ID not found. Please refresh and try again.", "error");
            return;
        }

        setUpdateLoading(true);

        // const updateUrl = `http://localhost:5000/api/events/update-event/${eventId}`;
        const updateUrl = `https://eventflow-backend-fwv4.onrender.com/api/events/update-event/${eventId}`;
        console.log("[MyEvent] Update URL:", updateUrl);

        const locationPayload = {
            venue: editFormData.venue || editingEvent?.location?.venue || editingEvent?.venue || "",
            address: editFormData.address || editingEvent?.location?.address || editingEvent?.address || "",
            city: editFormData.city || editingEvent?.location?.city || editingEvent?.city || "",
            state: editFormData.state || editingEvent?.location?.state || editingEvent?.state || "",
            country: editFormData.country || editingEvent?.location?.country || editingEvent?.country || "",
        };

        // ALWAYS use FormData - backend expects form-encoded data
        const formData = new FormData();
        formData.append("title", editFormData.title || "");
        formData.append("category", editFormData.category || "");
        formData.append("description", editFormData.description || "");
        formData.append("isFree", String(Boolean(editFormData.isFree)));
        formData.append("startDate", editFormData.startDate || "");
        formData.append("startTime", editFormData.startTime || "");
        formData.append("endDate", editFormData.endDate || "");
        formData.append("endTime", editFormData.endTime || "");
        formData.append("timeZone", editingEvent?.timeZone || "Africa/Lagos");
        formData.append("venue", editFormData.venue || "");
        formData.append("address", editFormData.address || "");
        formData.append("city", editFormData.city || "");
        formData.append("state", editFormData.state || "");
        formData.append("country", editFormData.country || "");
        formData.append("location", JSON.stringify(locationPayload));

        if (!editFormData.isFree) {
            const existingQuantity = Number(editingEvent?.ticketTypes?.[0]?.quantity ?? 10);
            const existingName = editingEvent?.ticketTypes?.[0]?.name || "General Admission";
            formData.append("ticketTypes", JSON.stringify([
                {
                    name: existingName,
                    ticketPrice: Number(editFormData.ticketPrice || 0),
                    quantity: Number.isFinite(existingQuantity) ? existingQuantity : 10,
                },
            ]));
        } else {
            formData.append("ticketTypes", JSON.stringify([]));
        }

        // Add banner file if selected
        if (editFormData.bannerFile) {
            formData.append("banner", editFormData.bannerFile);
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let browser set it for FormData with boundary
        };

        console.log("[MyEvent] FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        axios
            .patch(updateUrl, formData, { headers })
            .then((response) => {
                console.log("[MyEvent] Update successful:", response.data);
                const updatedEventFromApi = response?.data?.event;
                setMyEvents((prev) =>
                    prev.map((event) =>
                        (event._id === eventId || event.id === eventId)
                            ? {
                                  ...event,
                                  ...(updatedEventFromApi || {}),
                              }
                            : event
                    )
                );
                setEditingEvent(null);
                setEditFormData({});
                showNotification("Event updated successfully!", "success");
                
                // Notify other pages (like BrowseEventPage) that an event was updated
                window.dispatchEvent(new CustomEvent("eventUpdated", { detail: { eventId } }));
            })
            .catch((err) => {
                console.error("[MyEvent] Error updating event:");
                console.error("  Status:", err.response?.status);
                console.error("  Message:", err.response?.data?.message);
                console.error("  Error data:", err.response?.data);
                console.error("  Full error:", err);
                showNotification(err.response?.data?.message || "Failed to update event", "error");
            })
            .finally(() => {
                setUpdateLoading(false);
            });
    };

    const handleViewDetails = (event) => {
        setSelectedEvent(event);
    };

    const showNotification = (message, type = "info") => {
        const id = Date.now();
        const notification = { id, message, type };
        setNotifications((prev) => [...prev, notification]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    };

    const handleDeleteEvent = (eventId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            showNotification("Authentication required", "error");
            return;
        }

        setDeleteLoading(true);

        axios
            .delete(`https://eventflow-backend-fwv4.onrender.com/api/events/delete-event/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setMyEvents((prev) => prev.filter((event) => event._id !== eventId));
                setDeleteConfirm(null);
                showNotification("Event deleted successfully", "success");
            })
            .catch((err) => {
                console.error("Error deleting event:", err);
                showNotification(err.response?.data?.message || "Failed to delete event", "error");
            })
            .finally(() => {
                setDeleteLoading(false);
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
                                            <div className="btn-group btn-group-sm gap-3" role="group">
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
                                                    onClick={() => handleEditEvent(event)}
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
                                <button className="btn btn-light" onClick={() => setDeleteConfirm(null)} disabled={deleteLoading}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDeleteEvent(deleteConfirm)} disabled={deleteLoading}>
                                    {deleteLoading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
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
                                                    {ticket?.name || "Ticket"} - ${Number((ticket?.ticketPrice ?? ticket?.price) || 0).toLocaleString()}
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

            {editingEvent ? (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Event</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setEditingEvent(null)}
                                    disabled={updateLoading}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="eventTitle" className="form-label">
                                            Event Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="eventTitle"
                                            value={editFormData.title || ""}
                                            onChange={(e) =>
                                                handleEditFormChange("title", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="eventCategory" className="form-label">
                                                Category
                                            </label>
                                            <select
                                                className="form-select"
                                                id="eventCategory"
                                                value={editFormData.category || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("category", e.target.value)
                                                }
                                            >
                                                <option value="">Select category</option>
                                                <option value="Music">Music</option>
                                                <option value="Sports">Sports</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Business">Business</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Educational">Educational</option>
                                                <option value="Social">Social</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="eventFree" className="form-label">
                                                Event Type
                                            </label>
                                            <select
                                                className="form-select"
                                                id="eventFree"
                                                value={editFormData.isFree ? "free" : "paid"}
                                                onChange={(e) =>
                                                    handleEditFormChange(
                                                        "isFree",
                                                        e.target.value === "free"
                                                    )
                                                }
                                            >
                                                <option value="paid">Paid Event</option>
                                                <option value="free">Free Event</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="eventDescription" className="form-label">
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="eventDescription"
                                            rows="4"
                                            value={editFormData.description || ""}
                                            onChange={(e) =>
                                                handleEditFormChange("description", e.target.value)
                                            }
                                        ></textarea>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="startDate" className="form-label">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="startDate"
                                                value={editFormData.startDate || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("startDate", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="startTime" className="form-label">
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="startTime"
                                                value={editFormData.startTime || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("startTime", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="endDate" className="form-label">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="endDate"
                                                value={editFormData.endDate || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("endDate", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="endTime" className="form-label">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="endTime"
                                                value={editFormData.endTime || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("endTime", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {!editFormData.isFree ? (
                                        <div className="mb-3">
                                            <label htmlFor="ticketPrice" className="form-label">
                                                Ticket Price (USD)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                step="0.01"
                                                className="form-control"
                                                id="ticketPrice"
                                                value={editFormData.ticketPrice || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("ticketPrice", e.target.value)
                                                }
                                            />
                                        </div>
                                    ) : null}

                                    <div className="mb-3">
                                        <label htmlFor="bannerImage" className="form-label">
                                            Banner Image
                                        </label>
                                        {editFormData.bannerImage && !editFormData.bannerFile ? (
                                            <div className="mb-2">
                                                <img
                                                    src={editFormData.bannerImage}
                                                    alt="Current banner"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "150px",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                                <small className="text-secondary d-block mt-1">
                                                    Current banner. Upload a new image to replace.
                                                </small>
                                            </div>
                                        ) : null}
                                        {editFormData.bannerFile ? (
                                            <div className="mb-2">
                                                <img
                                                    src={URL.createObjectURL(editFormData.bannerFile)}
                                                    alt="New banner preview"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "150px",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                                <small className="text-success d-block mt-1">
                                                    New banner: {editFormData.bannerFile.name}
                                                </small>
                                            </div>
                                        ) : null}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-control"
                                            id="bannerImage"
                                            onChange={(e) => handleBannerChange(e.target.files?.[0] || null)}
                                        />
                                    </div>

                                    <h6 className="mb-3 fw-semibold">Location Details</h6>

                                    <div className="mb-3">
                                        <label htmlFor="venueName" className="form-label">
                                            Venue Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="venueName"
                                            value={editFormData.venue || ""}
                                            onChange={(e) =>
                                                handleEditFormChange("venue", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            value={editFormData.address || ""}
                                            onChange={(e) =>
                                                handleEditFormChange("address", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="city" className="form-label">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="city"
                                                value={editFormData.city || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("city", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="state" className="form-label">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="state"
                                                value={editFormData.state || ""}
                                                onChange={(e) =>
                                                    handleEditFormChange("state", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="country" className="form-label">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="country"
                                            value={editFormData.country || ""}
                                            onChange={(e) =>
                                                handleEditFormChange("country", e.target.value)
                                            }
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-light"
                                    onClick={() => setEditingEvent(null)}
                                    disabled={updateLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSaveEvent}
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Toast Notifications */}
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    maxWidth: "500px",
                    width: "90%",
                }}
            >
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        style={{
                            marginBottom: "10px",
                            animation: "slideIn 0.3s ease-in-out",
                        }}
                    >
                        <div
                            className={`alert alert-${
                                notification.type === "success"
                                    ? "success"
                                    : notification.type === "error"
                                    ? "danger"
                                    : "info"
                            } d-flex align-items-center gap-2 mb-0`}
                            role="alert"
                            style={{
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                borderRadius: "8px",
                                animation: "slideOut 0.3s ease-in-out 2.7s forwards",
                            }}
                        >
                            {notification.type === "success" && (
                                <i className="bi bi-check-circle-fill"></i>
                            )}
                            {notification.type === "error" && (
                                <i className="bi bi-exclamation-circle-fill"></i>
                            )}
                            {notification.type === "info" && (
                                <i className="bi bi-info-circle-fill"></i>
                            )}
                            <span>{notification.message}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    to {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyEvent;
