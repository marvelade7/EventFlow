import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/apiConfig";

const AdminManageUsers = ({ searchTerm = "", onActivity }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
            setError("Admin session expired. Please sign in again.");
            setLoading(false);
            return;
        }

        axios
            .get(apiUrl("/admin/users"), {
                headers: { Authorization: `Bearer ${adminToken}` },
            })
            .then((res) => {
                const data = res.data;
                setUsers(Array.isArray(data) ? data : data?.users || []);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to load users.");
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            `${user.firstName || ""} ${user.lastName || ""} ${user.email || ""} ${user.role || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [users, searchTerm]);

    const handleDeleteUser = (userId) => {
        const target = users.find((user) => user._id === userId || user.id === userId);
        setUsers((prev) => prev.filter((user) => (user._id || user.id) !== userId));
        if (target && onActivity) onActivity(`Deleted user "${target.firstName || target.name || target.email || "Unknown"}".`);
    };

    const handleToggleUserStatus = (userId) => {
        const target = users.find((user) => user._id === userId || user.id === userId);
        if (!target) return;

        const nextStatus = (target.status || "active").toLowerCase() === "active" ? "Suspended" : "Active";
        setUsers((prev) =>
            prev.map((user) =>
                (user._id || user.id) === userId ? { ...user, status: nextStatus } : user,
            ),
        );

        if (onActivity) onActivity(`${nextStatus} user "${target.firstName || target.name || target.email || "Unknown"}".`);
    };

    if (loading) {
        return (
            <section className="admin-card" data-aos="fade-up">
                <p className="m-0">Loading users...</p>
            </section>
        );
    }

    return (
        <section className="admin-card" data-aos="fade-up">
            <div className="mb-4">
                <p className="admin-section-kicker">User Management</p>
                <h4 className="m-0">Manage attendee and organizer access</h4>
            </div>

            {error ? <p className="text-danger mb-3">{error}</p> : null}

            <div style={{ overflowX: "auto", width: "100%", display: "block" }}>
                <table className="table admin-table align-middle mb-0" style={{ width: "100%", minWidth: "1200px" }}>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Phone</th>
                            <th>Verified</th>
                            <th>Signed Up</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => {
                            const userId = user._id || user.id;
                            const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Unknown user";
                            const status = user.status || "Active";
                            const role = user.role || (user.isAdmin ? "Admin" : "User");
                            const signupDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-";

                            const verifiedStatus = user.isVerified ? "Verified" : "Pending";
                            const locationDisplay = user.location || "-";
                            const phoneDisplay = user.phoneNumber || "-";
                            const initials = `${(user.firstName || "")[0]}${(user.lastName || "")[0]}`.toUpperCase() || "U";

                            return (
                                <tr key={userId || `${name}-${index}`} data-aos="fade-up" data-aos-delay={Math.min(index * 60, 220)}>
                                    <td>
                                        {user.profilePic ? (
                                            <img
                                                src={user.profilePic}
                                                alt={name}
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#6c757d",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {initials}
                                            </div>
                                        )}
                                    </td>
                                    <td className="fw-semibold">{name}</td>
                                    <td>{user.email || "-"}</td>
                                    <td>{locationDisplay}</td>
                                    <td>{phoneDisplay}</td>
                                    <td>
                                        <span className={`admin-status-chip ${user.isVerified ? "approved" : "pending"}`}>
                                            {verifiedStatus}
                                        </span>
                                    </td>
                                    <td>{signupDate}</td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                className="btn admin-mini-btn"
                                                onClick={() => handleToggleUserStatus(userId)}
                                            >
                                                {status === "Active" ? "Suspend" : "Restore"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn admin-mini-btn danger"
                                                onClick={() => handleDeleteUser(userId)}
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

export default AdminManageUsers;
