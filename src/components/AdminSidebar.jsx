import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const navItems = [
    { id: "overview", label: "Overview", icon: "bi bi-grid" },
    { id: "events", label: "Manage Events", icon: "bi bi-calendar2-event" },
    { id: "users", label: "Manage Users", icon: "bi bi-people" },
    { id: "posts", label: "Moderate Posts", icon: "bi bi-chat-left-text" },
    { id: "controls", label: "Platform Control", icon: "bi bi-shield-lock" },
];

const AdminSidebar = ({
    activeSection,
    onSelectSection,
    mobileOpen = false,
}) => {
    return (
        <aside
            className={`sidebar admin-sidebar ${mobileOpen ? "sidebar-mobile-open" : ""}`}
        >
            <div>
                <div className="d-flex align-items-center justify-content-between gap-2">
                    <Logo size={40} fontSize="1.25em" />
                    <span className="admin-badge">Admin</span>
                </div>

                <div className="admin-sidebar-panel mt-4">
                    <p className="admin-sidebar-label">Control Center</p>
                    <h5 className="m-0 text-white">Platform command desk</h5>
                    <p className="m-0 mt-2 admin-sidebar-copy">
                        Keep the marketplace safe, active, and organized.
                    </p>
                </div>

                <ul className="links admin-links">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => onSelectSection(item.id)}
                            className={activeSection === item.id ? "active" : ""}
                        >
                            <i className={`${item.icon} fs-5`}></i>
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="profile admin-profile">
                <div className="admin-profile-avatar">
                    <i className="bi bi-shield-check"></i>
                </div>
                <div className="w-100">
                    <p className="m-0 fw-semibold text-white">Ava Admin</p>
                    <p className="m-0 admin-sidebar-copy">Super Admin</p>
                </div>
                <Link to="/admin-auth" className="text-white">
                    <i className="bi bi-box-arrow-right"></i>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;
