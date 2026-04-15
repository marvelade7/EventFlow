import React from "react";
import { Link } from "react-router-dom";

const AdminTopbar = ({
    onToggleSidebar,
    isSidebarOpen,
    searchTerm,
    onSearchChange,
}) => {
    return (
        <div className="dash-navbar admin-topbar">
            <div className="d-flex align-items-center gap-2">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="btn btn-light border dashboard-menu-btn"
                    aria-label="Toggle sidebar"
                >
                    <i className={`bi ${isSidebarOpen ? "bi-x-lg" : "bi-list"}`}></i>
                </button>
                <div>
                    <p className="m-0 admin-topbar-kicker">ADMIN DASHBOARD</p>
                    <h5 className="m-0">Command Center</h5>
                </div>
            </div>

            <div className="d-flex align-items-center gap-3 dash-navbar-actions">
                <div className="border rounded-2 d-flex align-items-center gap-2 py-1 px-3 input-group admin-search">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search users, events, posts..."
                    />
                </div>
                <Link to="/create-event" className="text-decoration-none">
                    <button className="btn admin-create-btn text-white fw-semibold">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Event
                    </button>
                </Link>
                <div className="admin-alert-pill">
                    <i className="bi bi-bell"></i>
                    6 alerts
                </div>
            </div>
        </div>
    );
};

export default AdminTopbar;
