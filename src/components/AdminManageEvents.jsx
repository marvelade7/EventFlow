import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/apiConfig";

const AdminManageEvents = ({ searchTerm = "", onActivity }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const formatLocation = (location) => {
        if (!location) return "-";
        if (typeof location === "string") return location;
        if (typeof location !== "object") return String(location);

        const parts = [location.venue, location.address, location.city, location.country].filter(Boolean);
        return parts.length ? parts.join(", ") : "-";
    };

    const formatTextValue = (value, fallback = "-") => {
        if (value == null) return fallback;
        if (typeof value === "string" || typeof value === "number") return String(value);
        return fallback;
    };

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
            setError("Admin session expired. Please sign in again.");
            setLoading(false);
            return;
        }

        axios
            .get(apiUrl("/admin/events"), {
                headers: { Authorization: `Bearer ${adminToken}` },
            })
            .then((res) => {
                const data = res.data;
                setEvents(Array.isArray(data) ? data : data?.events || []);
            })
            .catch((err) => {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin/login");
                    return;
                }

                setError(err.response?.data?.message || "Failed to load events.");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) =>
            `${formatTextValue(event.name, "")} ${formatTextValue(event.organiserName, "")} ${formatLocation(event.location)} ${formatTextValue(event.category, "")} ${formatTextValue(event.status, "")}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [events, searchTerm]);

    const handleDeleteEvent = (eventId) => {
        const target = events.find((event) => event._id === eventId || event.id === eventId);
        setEvents((prev) => prev.filter((event) => (event._id || event.id) !== eventId));
        if (target && onActivity) onActivity(`Deleted event "${target.name || "Untitled"}".`);
    };

    const handleToggleEventStatus = (eventId) => {
        const target = events.find((event) => event._id === eventId || event.id === eventId);
        if (!target) return;

        const nextStatus =
            (target.status || "").toLowerCase() === "published" ? "Archived" : "Published";

        setEvents((prev) =>
            prev.map((event) =>
                (event._id || event.id) === eventId ? { ...event, status: nextStatus } : event,
            ),
        );

        if (onActivity) onActivity(`${nextStatus} event "${target.name || "Untitled"}".`);
    };

    if (loading) {
        return (
            <section className="admin-card" data-aos="fade-up">
                <p className="m-0">Loading events...</p>
            </section>
        );
    }

    return (
        <section className="admin-card" data-aos="fade-up">
            <div className="d-flex align-items-center justify-content-between gap-3 mb-4 flex-wrap">
                <div>
                    <p className="admin-section-kicker">Event Management</p>
                    <h4 className="m-0">Create, publish, archive, or delete events</h4>
                </div>
            </div>

            {error ? <p className="text-danger mb-3">{error}</p> : null}

            <div style={{ overflowX: "auto", width: "100%", display: "block" }}>
                <table className="table admin-table align-middle mb-0" style={{ width: "100%", minWidth: "1200px" }}>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Organizer</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Category</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event, index) => {
                            const eventId = event._id || event.id;
                            const title = formatTextValue(event.name, "Untitled event");
                            const organizer = formatTextValue(
                                event.organiserName || (event.organiser ? `${event.organiser.firstName || ""} ${event.organiser.lastName || ""}`.trim() : null),
                                "Unknown",
                            );
                            const status = formatTextValue(event.status, "Draft");
                            const eventDate = event.date ? new Date(event.date).toLocaleDateString() : "-";
                            const createdDate = event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "-";
                            const location = formatLocation(event.location);
                            const category = formatTextValue(event.category, "-");

                            return (
                                <tr key={eventId || `${title}-${index}`} data-aos="fade-up" data-aos-delay={Math.min(index * 60, 220)}>
                                    <td className="fw-semibold">{title}</td>
                                    <td>{organizer}</td>
                                    <td>{eventDate}</td>
                                    <td>{location}</td>
                                    <td>{category}</td>
                                    <td>{createdDate}</td>
                                    <td>
                                        <span className={`admin-status-chip ${status.toLowerCase().replace(/\s+/g, "-")}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                className="btn admin-mini-btn"
                                                onClick={() => handleToggleEventStatus(eventId)}
                                            >
                                                {status === "Published" ? "Archive" : "Publish"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn admin-mini-btn danger"
                                                onClick={() => handleDeleteEvent(eventId)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminManageEvents;
