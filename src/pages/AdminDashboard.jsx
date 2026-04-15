import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

const initialEvents = [
    {
        id: 1,
        title: "Lagos Sound Summit",
        organizer: "CityWave Media",
        date: "May 18, 2026",
        status: "Published",
        revenue: "$12,480",
    },
    {
        id: 2,
        title: "Future of Commerce Expo",
        organizer: "GrowthLab Africa",
        date: "June 02, 2026",
        status: "Draft",
        revenue: "$0",
    },
    {
        id: 3,
        title: "Abuja Design Week",
        organizer: "Haus Creative",
        date: "July 11, 2026",
        status: "Flagged",
        revenue: "$4,920",
    },
];

const initialUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Attendee",
        status: "Active",
        joined: "Jan 14, 2026",
    },
    {
        id: 2,
        name: "Maya Cole",
        email: "maya@hauscreative.com",
        role: "Organizer",
        status: "Suspended",
        joined: "Feb 02, 2026",
    },
    {
        id: 3,
        name: "Daniel Obi",
        email: "daniel@citywave.co",
        role: "Organizer",
        status: "Active",
        joined: "Mar 09, 2026",
    },
];

const initialPosts = [
    {
        id: 1,
        title: "Aftermovie teaser for Lagos Sound Summit",
        author: "CityWave Media",
        category: "Promotion",
        reports: 0,
        status: "Approved",
    },
    {
        id: 2,
        title: "Win backstage passes now",
        author: "Unknown Promoter",
        category: "Campaign",
        reports: 7,
        status: "Under Review",
    },
    {
        id: 3,
        title: "Community meetup recap",
        author: "Haus Creative",
        category: "Community",
        reports: 1,
        status: "Pending",
    },
];

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState(initialEvents);
    const [users, setUsers] = useState(initialUsers);
    const [posts, setPosts] = useState(initialPosts);
    const [announcements, setAnnouncements] = useState([
        "Security scan completed for all organizer accounts.",
        "2 flagged events need manual review today.",
    ]);
    const [announcementDraft, setAnnouncementDraft] = useState("");
    const [activityLog, setActivityLog] = useState([
        "Published spotlight banner for Lagos Sound Summit.",
        "Suspended one organizer account for policy review.",
        "Removed 1 reported promotional post from the feed.",
    ]);

    const addActivity = (message) => {
        setActivityLog((prev) => [message, ...prev].slice(0, 6));
    };

    const filteredEvents = useMemo(() => {
        return events.filter((event) =>
            `${event.title} ${event.organizer} ${event.status}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [events, searchTerm]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            `${user.name} ${user.email} ${user.role} ${user.status}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [users, searchTerm]);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) =>
            `${post.title} ${post.author} ${post.status} ${post.category}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [posts, searchTerm]);

    const stats = [
        {
            title: "Total Users",
            value: users.length,
            meta: "People on EventFlow",
            icon: "bi bi-people",
            accent: "cyan",
        },
        {
            title: "Live Events",
            value: events.filter((event) => event.status === "Published").length,
            meta: "Currently visible to users",
            icon: "bi bi-calendar2-check",
            accent: "orange",
        },
        {
            title: "Flagged Items",
            value:
                events.filter((event) => event.status === "Flagged").length +
                posts.filter((post) => post.status !== "Approved").length,
            meta: "Need admin attention",
            icon: "bi bi-flag",
            accent: "danger",
        },
        {
            title: "Moderation Queue",
            value: posts.filter((post) => post.status !== "Approved").length,
            meta: "Posts awaiting action",
            icon: "bi bi-shield-exclamation",
            accent: "purple",
        },
    ];

    const handleSectionSelect = (section) => {
        setActiveSection(section);
        setSidebarOpen(false);
    };

    const handleDeleteEvent = (eventId) => {
        const target = events.find((event) => event.id === eventId);
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
        if (target) addActivity(`Deleted event "${target.title}".`);
    };

    const handleToggleEventStatus = (eventId) => {
        const target = events.find((event) => event.id === eventId);
        if (!target) return;
        const nextStatus =
            target.status === "Published" ? "Archived" : "Published";

        setEvents((prev) =>
            prev.map((event) =>
                event.id === eventId ? { ...event, status: nextStatus } : event,
            ),
        );

        addActivity(
            `${nextStatus === "Published" ? "Published" : "Archived"} event "${target.title}".`,
        );
    };

    const handleDeleteUser = (userId) => {
        const target = users.find((user) => user.id === userId);
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        if (target) addActivity(`Deleted user "${target.name}".`);
    };

    const handleToggleUserStatus = (userId) => {
        const target = users.find((user) => user.id === userId);
        if (!target) return;
        const nextStatus = target.status === "Active" ? "Suspended" : "Active";

        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId ? { ...user, status: nextStatus } : user,
            ),
        );

        addActivity(`${nextStatus} user "${target.name}".`);
    };

    const handleDeletePost = (postId) => {
        const target = posts.find((post) => post.id === postId);
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        if (target) addActivity(`Deleted post "${target.title}".`);
    };

    const handleModeratePost = (postId, status) => {
        const target = posts.find((post) => post.id === postId);
        if (!target) return;

        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId ? { ...post, status } : post,
            ),
        );

        addActivity(`${status} post "${target.title}".`);
    };

    const handleAddAnnouncement = (e) => {
        e.preventDefault();
        const trimmed = announcementDraft.trim();
        if (!trimmed) return;
        setAnnouncements((prev) => [trimmed, ...prev].slice(0, 4));
        addActivity(`Posted platform announcement: "${trimmed}".`);
        setAnnouncementDraft("");
    };

    const renderOverview = () => (
        <div className="d-flex flex-column gap-4">
            <section className="admin-hero-card">
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
                        onClick={() => setActiveSection("posts")}
                        className="btn admin-secondary-btn fw-semibold"
                    >
                        Review Reported Posts
                    </button>
                </div>
            </section>

            <section className="admin-stats-grid">
                {stats.map((stat) => (
                    <div key={stat.title} className={`admin-stat-card ${stat.accent}`}>
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

            <section className="admin-two-column">
                <div className="admin-card">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                        <div>
                            <p className="admin-section-kicker">Recent Activity</p>
                            <h5 className="m-0">Admin action log</h5>
                        </div>
                        <span className="admin-status-chip neutral">Live</span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        {activityLog.map((activity) => (
                            <div key={activity} className="admin-list-row">
                                <div className="admin-list-icon">
                                    <i className="bi bi-lightning-charge"></i>
                                </div>
                                <p className="m-0">{activity}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-card">
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

    const renderEvents = () => (
        <section className="admin-card">
            <div className="d-flex align-items-center justify-content-between gap-3 mb-4 flex-wrap">
                <div>
                    <p className="admin-section-kicker">Event Management</p>
                    <h4 className="m-0">Create, publish, archive, or delete events</h4>
                </div>
                <Link to="/create-event" className="text-decoration-none">
                    <button className="btn admin-primary-btn text-white fw-semibold">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Event
                    </button>
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table admin-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Organizer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Revenue</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event) => (
                            <tr key={event.id}>
                                <td className="fw-semibold">{event.title}</td>
                                <td>{event.organizer}</td>
                                <td>{event.date}</td>
                                <td>
                                    <span
                                        className={`admin-status-chip ${event.status.toLowerCase().replace(/\s+/g, "-")}`}
                                    >
                                        {event.status}
                                    </span>
                                </td>
                                <td>{event.revenue}</td>
                                <td>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn"
                                            onClick={() => handleToggleEventStatus(event.id)}
                                        >
                                            {event.status === "Published"
                                                ? "Archive"
                                                : "Publish"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn danger"
                                            onClick={() => handleDeleteEvent(event.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

    const renderUsers = () => (
        <section className="admin-card">
            <div className="mb-4">
                <p className="admin-section-kicker">User Management</p>
                <h4 className="m-0">Manage attendee and organizer access</h4>
            </div>

            <div className="table-responsive">
                <table className="table admin-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="fw-semibold">{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span
                                        className={`admin-status-chip ${user.status.toLowerCase()}`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td>{user.joined}</td>
                                <td>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn"
                                            onClick={() => handleToggleUserStatus(user.id)}
                                        >
                                            {user.status === "Active"
                                                ? "Suspend"
                                                : "Restore"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn danger"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

    const renderPosts = () => (
        <section className="admin-card">
            <div className="mb-4">
                <p className="admin-section-kicker">Content Moderation</p>
                <h4 className="m-0">Approve, review, or delete community posts</h4>
            </div>

            <div className="table-responsive">
                <table className="table admin-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Post</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Reports</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => (
                            <tr key={post.id}>
                                <td className="fw-semibold">{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.category}</td>
                                <td>{post.reports}</td>
                                <td>
                                    <span
                                        className={`admin-status-chip ${post.status.toLowerCase().replace(/\s+/g, "-")}`}
                                    >
                                        {post.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn"
                                            onClick={() =>
                                                handleModeratePost(post.id, "Approved")
                                            }
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn"
                                            onClick={() =>
                                                handleModeratePost(post.id, "Under Review")
                                            }
                                        >
                                            Review
                                        </button>
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn danger"
                                            onClick={() => handleDeletePost(post.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

    const renderControls = () => (
        <div className="admin-two-column">
            <section className="admin-card">
                <div className="mb-4">
                    <p className="admin-section-kicker">Platform Controls</p>
                    <h4 className="m-0">Push updates and act fast</h4>
                </div>

                <form onSubmit={handleAddAnnouncement}>
                    <label htmlFor="announcementDraft">
                        New platform announcement
                    </label>
                    <textarea
                        id="announcementDraft"
                        className="form-control shadow-none"
                        rows="4"
                        value={announcementDraft}
                        onChange={(e) => setAnnouncementDraft(e.target.value)}
                        placeholder="Notify organizers about policy changes, maintenance windows, or featured campaigns..."
                    ></textarea>
                    <button
                        type="submit"
                        className="btn admin-primary-btn text-white fw-semibold mt-2"
                    >
                        Post Announcement
                    </button>
                </form>

                <div className="d-flex flex-column gap-3 mt-4">
                    {announcements.map((announcement) => (
                        <div key={announcement} className="admin-list-row">
                            <div className="admin-list-icon megaphone">
                                <i className="bi bi-megaphone"></i>
                            </div>
                            <p className="m-0">{announcement}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="admin-card">
                <div className="mb-4">
                    <p className="admin-section-kicker">High Priority</p>
                    <h4 className="m-0">Suggested admin actions</h4>
                </div>

                <div className="d-flex flex-column gap-3">
                    <button
                        type="button"
                        className="btn admin-action-btn"
                        onClick={() => setActiveSection("events")}
                    >
                        <span>
                            <strong>Review flagged events</strong>
                            <small>Open the event panel and resolve risky listings.</small>
                        </span>
                        <i className="bi bi-arrow-right"></i>
                    </button>
                    <button
                        type="button"
                        className="btn admin-action-btn"
                        onClick={() => setActiveSection("users")}
                    >
                        <span>
                            <strong>Audit organizer accounts</strong>
                            <small>Restore or suspend access based on review status.</small>
                        </span>
                        <i className="bi bi-arrow-right"></i>
                    </button>
                    <Link to="/create-event" className="text-decoration-none">
                        <button type="button" className="btn admin-action-btn">
                            <span>
                                <strong>Create a featured event</strong>
                                <small>Use the existing event builder from the admin side.</small>
                            </span>
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );

    const sectionMap = {
        overview: renderOverview(),
        events: renderEvents(),
        users: renderUsers(),
        posts: renderPosts(),
        controls: renderControls(),
    };

    return (
        <div className="admin-dashboard-page">
            <AdminSidebar
                activeSection={activeSection}
                onSelectSection={handleSectionSelect}
                mobileOpen={sidebarOpen}
            />
            <div
                className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <div className="admin-dashboard-main">
                <AdminTopbar
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    isSidebarOpen={sidebarOpen}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                <div className="admin-dashboard-content">
                    {sectionMap[activeSection]}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
