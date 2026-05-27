import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/apiConfig";

const AdminManageEvents = ({ searchTerm = "", onActivity }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            `${event.title || ""} ${event.organizer || ""} ${event.status || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [events, searchTerm]);

    const handleDeleteEvent = (eventId) => {
        const target = events.find((event) => event._id === eventId || event.id === eventId);
        setEvents((prev) => prev.filter((event) => (event._id || event.id) !== eventId));
        if (target && onActivity) onActivity(`Deleted event "${target.title || target.name || "Untitled"}".`);
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

        if (onActivity) onActivity(`${nextStatus} event "${target.title || target.name || "Untitled"}".`);
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

            <div className="table-responsive">
                <table className="table admin-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Organizer</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event, index) => {
                            const eventId = event._id || event.id;
                            const title = event.title || event.name || "Untitled event";
                            const organizer = event.organizer?.name || event.organizer || event.user?.name || event.createdBy || "Unknown";
                            const status = event.status || event.visibility || "Draft";
                            const createdDate = event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "-";

                            return (
                                <tr key={eventId || `${title}-${index}`} data-aos="fade-up" data-aos-delay={Math.min(index * 60, 220)}>
                                    <td className="fw-semibold">{title}</td>
                                    <td>{organizer}</td>
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
