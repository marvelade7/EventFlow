import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScannerPage.css";

const defaultTicket = {
    attendeeName: "Full name",
    eventName: "Event name",
    ticketType: "Ticket type",
    ticketCode: "Ticket code",
    checkedInTime: "Check in time",
    avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80",
};

const ScannerPage = () => {
    const navigate = useNavigate();
    const [ticketState, setTicketState] = useState("idle");
    const [isSuccessFlash, setIsSuccessFlash] = useState(false);
    const successTimerRef = useRef(null);
    const resetTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (successTimerRef.current)
                window.clearTimeout(successTimerRef.current);
            if (resetTimerRef.current)
                window.clearTimeout(resetTimerRef.current);
        };
    }, []);

    const handleConfirmCheckIn = () => {
        setTicketState("success");
        setIsSuccessFlash(true);

        if (successTimerRef.current)
            window.clearTimeout(successTimerRef.current);
        if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);

        successTimerRef.current = window.setTimeout(() => {
            setIsSuccessFlash(false);
        }, 900);

        resetTimerRef.current = window.setTimeout(() => {
            setTicketState("idle");
            setIsSuccessFlash(false);
        }, 3200);
    };

    const closeResultModal = () => {
        setTicketState("idle");
        setIsSuccessFlash(false);
    };

    const renderResultContent = () => {
        if (ticketState === "idle") return null;

        if (ticketState === "invalid") {
            return (
                <div className="scanner-result-card scanner-result-card--error">
                    <div className="scanner-result-icon-wrap scanner-result-icon-wrap--error">
                        <i className="bi bi-x-circle-fill scanner-result-icon" />
                    </div>
                    <div>
                        <p className="scanner-result-eyebrow">
                            Verification failed
                        </p>
                        <h2 className="scanner-result-title">Invalid ticket</h2>
                        <p className="scanner-result-text">
                            The QR code could not be matched to an active
                            booking.
                        </p>
                    </div>
                </div>
            );
        }

        if (ticketState === "already_checked_in") {
            return (
                <div className="scanner-result-card scanner-result-card--warning">
                    <div className="scanner-result-icon-wrap scanner-result-icon-wrap--warning">
                        <i className="bi bi-exclamation-triangle-fill scanner-result-icon" />
                    </div>
                    <div className="scanner-result-stack">
                        <p className="scanner-result-eyebrow">
                            Duplicate scan detected
                        </p>
                        <h2 className="scanner-result-title">
                            Already checked in
                        </h2>
                        <p className="scanner-result-text">
                            Checked in at {defaultTicket.checkedInTime}
                        </p>
                    </div>
                    <div className="scanner-result-meta">
                        <span className="scanner-meta-pill">Time logged</span>
                    </div>
                </div>
            );
        }

        if (ticketState === "success") {
            return (
                <div className="scanner-result-card scanner-result-card--success scanner-result-card--success-flash">
                    <div className="scanner-result-icon-wrap scanner-result-icon-wrap--success">
                        <i className="bi bi-check2-circle scanner-result-icon" />
                    </div>
                    <div className="scanner-result-stack">
                        <p className="scanner-result-eyebrow">Confirmed</p>
                        <h2 className="scanner-result-title">
                            Check-in successful
                        </h2>
                        <p className="scanner-result-text">
                            The attendee has been admitted and the gate log has
                            been updated.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="scanner-result-card scanner-result-card--success">
                <div className="scanner-result-header">
                    <div className="scanner-result-icon-wrap scanner-result-icon-wrap--success">
                        <i className="bi bi-shield-check scanner-result-icon" />
                    </div>
                    <div className="scanner-result-stack">
                        <p className="scanner-result-eyebrow">
                            Ticket verified
                        </p>
                        <h2 className="scanner-result-title">Valid ticket</h2>
                        <p className="scanner-result-text">
                            Review the booking details below before confirming
                            entry.
                        </p>
                    </div>
                    <div className="scanner-result-avatar-wrap">
                        <img
                            className="scanner-result-avatar"
                            src={defaultTicket.avatarUrl}
                            alt={defaultTicket.attendeeName}
                        />
                    </div>
                </div>

                <div className="scanner-result-details">
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">Attendee</span>
                        <span className="scanner-detail-value">
                            {defaultTicket.attendeeName}
                        </span>
                    </div>
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">Event</span>
                        <span className="scanner-detail-value">
                            {defaultTicket.eventName}
                        </span>
                    </div>
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">
                            Ticket Type
                        </span>
                        <span className="scanner-detail-value">
                            {defaultTicket.ticketType}
                        </span>
                    </div>
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">
                            Ticket Code
                        </span>
                        <span className="scanner-detail-code">
                            {defaultTicket.ticketCode}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="scanner-confirm-btn"
                    onClick={handleConfirmCheckIn}
                >
                    Confirm Check-In
                </button>
            </div>
        );
    };

    return (
        <main
            className={`scanner-page ${isSuccessFlash ? "scanner-page--flash" : ""}`}
        >
            <div className="scanner-shell">
                <header className="scanner-topbar">
                    <button
                        type="button"
                        className="scanner-back-btn"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <i className="bi bi-arrow-left" />
                    </button>
                    <div>
                        <p className="scanner-topbar-eyebrow">Ticket scanner</p>
                        <h1 className="scanner-topbar-title">Scan Tickets</h1>
                    </div>
                    <span className="scanner-live-pill">
                        <span className="scanner-live-dot" />
                        Live
                    </span>
                </header>

                <section className="scanner-stage">
                    <div className="scanner-camera-frame">
                        <div className="scanner-camera-glow" />
                        <div className="scanner-camera-card">
                            <div className="scanner-camera-viewfinder">
                                <div className="scanner-corner scanner-corner--tl" />
                                <div className="scanner-corner scanner-corner--tr" />
                                <div className="scanner-corner scanner-corner--bl" />
                                <div className="scanner-corner scanner-corner--br" />
                                <div className="scanner-scan-line" />
                                <div className="scanner-scan-grid" />
                                <div className="scanner-camera-center">
                                    <div className="scanner-camera-ring scanner-camera-ring--outer" />
                                    <div className="scanner-camera-ring scanner-camera-ring--inner" />
                                    <i className="bi bi-qr-code-scan scanner-camera-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="scanner-instruction">
                        Scanning for QR code...
                    </p>
                    <p className="scanner-supporting-text">
                        Position the ticket QR inside the frame. The scanner is
                        ready to detect instantly.
                    </p>
                </section>

                <section className="scanner-shortcuts">
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--ghost"
                        onClick={() => setTicketState("valid")}
                    >
                        Valid Ticket
                    </button>
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--error"
                        onClick={() => setTicketState("invalid")}
                    >
                        Invalid Ticket
                    </button>
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--warning"
                        onClick={() => setTicketState("already_checked_in")}
                    >
                        Already Checked In
                    </button>
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--ghost"
                        onClick={closeResultModal}
                    >
                        Clear Result
                    </button>
                </section>
            </div>

            {ticketState !== "idle" && (
                <div className="scanner-modal-backdrop" onClick={closeResultModal}>
                    <div
                        className="scanner-modal-shell"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="scanner-modal-close"
                            aria-label="Close scan result"
                            onClick={closeResultModal}
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                        {renderResultContent()}
                    </div>
                </div>
            )}
        </main>
    );
};

export default ScannerPage;
