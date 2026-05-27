import React, { useState } from "react";

const AdminPlatformControl = ({ onActivity }) => {
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
        if (onActivity) onActivity(message);
    };

    const handleAddAnnouncement = (e) => {
        e.preventDefault();
        const trimmed = announcementDraft.trim();
        if (!trimmed) return;
        setAnnouncements((prev) => [trimmed, ...prev].slice(0, 4));
        addActivity(`Posted platform announcement: "${trimmed}".`);
        setAnnouncementDraft("");
    };

    return (
        <div className="admin-two-column" data-aos="fade-up">
            <section className="admin-card" data-aos="fade-right" data-aos-delay="90">
                <div className="mb-4">
                    <p className="admin-section-kicker">Platform Controls</p>
                    <h4 className="m-0">Push updates and act fast</h4>
                </div>

                <form onSubmit={handleAddAnnouncement}>
                    <label htmlFor="announcementDraft">New platform announcement</label>
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

            <section className="admin-card" data-aos="fade-left" data-aos-delay="120">
                <div className="mb-4">
                    <p className="admin-section-kicker">High Priority</p>
                    <h4 className="m-0">Suggested admin actions</h4>
                </div>

                <div className="d-flex flex-column gap-3">
                    <div className="admin-action-btn">
                        <span>
                            <strong>Review flagged events</strong>
                            <small>Open the event panel and resolve risky listings.</small>
                        </span>
                        <i className="bi bi-arrow-right"></i>
                    </div>
                    <div className="admin-action-btn">
                        <span>
                            <strong>Audit organizer accounts</strong>
                            <small>Restore or suspend access based on review status.</small>
                        </span>
                        <i className="bi bi-arrow-right"></i>
                    </div>
                    <div className="admin-action-btn">
                        <span>
                            <strong>Create a featured event</strong>
                            <small>Use the existing event builder from the admin side.</small>
                        </span>
                        <i className="bi bi-arrow-right"></i>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminPlatformControl;
