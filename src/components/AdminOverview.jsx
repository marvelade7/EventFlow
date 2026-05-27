import React from "react";
import { Link } from "react-router-dom";

const AdminOverview = ({ stats = [], recentBookings = [], activityLog = [] }) => {
    return (
        <div className="d-flex flex-column gap-4">
            <section className="admin-hero-card" data-aos="fade-up">
                <div>
                    <p className="admin-hero-kicker">Command Center</p>
                    <h2 className="fw-semibold m-0">EventFlow platform oversight</h2>
                    <p className="m-0 mt-3 admin-hero-copy">
                        Watch platform health, review risky content, and step into
                        event operations without leaving the dashboard.
                    </p>
                </div>
                <div className="admin-hero-actions">
                    <Link to="/create-event" className="text-decoration-none">
                        <button className="btn admin-primary-btn text-white fw-semibold">
                            Create New Event
                        </button>
                    </Link>
                    <button
                        type="button"
                        className="btn admin-secondary-btn fw-semibold"
                    >
                        Review Reported Posts
                    </button>
                </div>
            </section>

            <section className="admin-stats-grid" data-aos="fade-up" data-aos-delay="70">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className={`admin-stat-card ${stat.accent}`}
                        data-aos="fade-up"
                        data-aos-delay="120"
                    >
                        <div className="d-flex align-items-start justify-content-between gap-3">
                            <div>
                                <p className="admin-stat-label">{stat.title}</p>
                                <h3 className="m-0 fw-semibold">{stat.value}</h3>
                            </div>
                            <i className={`${stat.icon} admin-stat-icon`}></i>
                        </div>
                        <p className="m-0 mt-3 admin-stat-meta">{stat.meta}</p>
                    </div>
                ))}
            </section>

            <section className="admin-two-column" data-aos="fade-up" data-aos-delay="120">
                <div className="admin-card" data-aos="fade-right" data-aos-delay="160">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                        <div>
                            <p className="admin-section-kicker">Recent Activity</p>
                            <h5 className="m-0">Latest action log</h5>
                        </div>
                        <span className="admin-status-chip neutral">Live</span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        {activityLog.length ? (
                            activityLog.map((activity) => (
                                <div key={activity} className="admin-list-row">
                                    <div className="admin-list-icon">
                                        <i className="bi bi-lightning-charge"></i>
                                    </div>
                                    <p className="m-0">{activity}</p>
                                </div>
                            ))
                        ) : (
                            <p className="m-0 text-secondary">No recent activity yet.</p>
                        )}
                    </div>
                </div>

                <div className="admin-card" data-aos="fade-left" data-aos-delay="180">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                        <div>
                            <p className="admin-section-kicker">Access Level</p>
                            <h5 className="m-0">What admins can do here</h5>
                        </div>
                        <span className="admin-status-chip purple">Full Access</span>
                    </div>
                    <div className="admin-permissions-grid">
                        <div className="admin-permission-box">
                            <i className="bi bi-plus-square"></i>
                            <p className="m-0 fw-semibold">Create and publish events</p>
                        </div>
                        <div className="admin-permission-box">
                            <i className="bi bi-trash3"></i>
                            <p className="m-0 fw-semibold">Delete users or events</p>
                        </div>
                        <div className="admin-permission-box">
                            <i className="bi bi-chat-left-dots"></i>
                            <p className="m-0 fw-semibold">Moderate and remove posts</p>
                        </div>
                        <div className="admin-permission-box">
                            <i className="bi bi-megaphone"></i>
                            <p className="m-0 fw-semibold">Send platform updates</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminOverview;
