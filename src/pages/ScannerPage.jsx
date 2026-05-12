import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
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
    const [cameraStatus, setCameraStatus] = useState("loading");
    const [scannedTicket, setScannedTicket] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const successTimerRef = useRef(null);
    const resetTimerRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        let isActive = true;

        const startCamera = () => {
            if (!navigator.mediaDevices?.getUserMedia) {
                setCameraStatus("unsupported");
                return;
            }

            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
                    },
                    audio: false,
                })
                .then((stream) => {
                    if (!isActive) {
                        stream.getTracks().forEach((track) => track.stop());
                        return;
                    }

                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play().catch(() => {});
                    }
                    setCameraStatus("ready");
                })
                .catch((error) => {
                    console.error("Unable to access camera:", error);
                    if (isActive) setCameraStatus("blocked");
                });
        };

        startCamera();

        return () => {
            isActive = false;
            if (successTimerRef.current)
                window.clearTimeout(successTimerRef.current);
            if (resetTimerRef.current)
                window.clearTimeout(resetTimerRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
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

    const restartCamera = () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraStatus("unsupported");
            return;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        setCameraStatus("loading");
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                },
                audio: false,
            })
            .then((stream) => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play().catch(() => {});
                }
                setCameraStatus("ready");
            })
            .catch((error) => {
                console.error("Unable to restart camera:", error);
                setCameraStatus("blocked");
            });
    };

    const postTicketCode = (ticketCode) => {
        setTicketState("verifying");
        setVerifying(true);

        axios
            .post(`${API_BASE_URL}/bookings/verify-qr`, { ticketCode })
            .then((res) => {
                const data = res && res.data ? res.data : null;
                if (data && data.booking) {
                    setScannedTicket(data.booking);

                    const booking = data.booking;
                    const status = booking.status || booking.state || null;

                    if (status === "checked-in" || booking.checkedIn) {
                        setTicketState("already_checked_in");
                    } else {
                        setTicketState("valid");
                    }
                } else {
                    setTicketState("invalid");
                }
            })
            .catch((err) => {
                console.error("Ticket verification failed:", err);
                setTicketState("invalid");
            })
            .finally(() => {
                setVerifying(false);
            });
    };

    const renderResultContent = () => {
        if (ticketState === "idle") return null;

        const ticket = scannedTicket || defaultTicket;

        if (ticketState === "verifying") {
            return (
                <div className="scanner-result-card">
                    <div className="scanner-result-stack">
                        <p className="scanner-result-eyebrow">Verifying</p>
                        <h2 className="scanner-result-title">
                            Checking ticket
                        </h2>
                        <p className="scanner-result-text">
                            Please wait while we verify this ticket.
                        </p>
                    </div>
                </div>
            );
        }

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
                            Checked in at {ticket.checkedInTime}
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
                            src={ticket.avatarUrl}
                            alt={ticket.attendeeName}
                        />
                    </div>
                </div>

                <div className="scanner-result-details">
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">Attendee</span>
                        <span className="scanner-detail-value">
                            {ticket.attendeeName}
                        </span>
                    </div>
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">Event</span>
                        <span className="scanner-detail-value">
                            {ticket.eventName}
                        </span>
                    </div>
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">
                            Ticket Type
                        </span>
                        <span className="scanner-detail-value">
                            {ticket.ticketType}
                        </span>
                    </div>
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">
                            Ticket Code
                        </span>
                        <span className="scanner-detail-code">
                            {ticket.ticketCode}
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
                        <div className="scanner-camera-card">
                            <div className="scanner-camera-viewfinder">
                                <video
                                    ref={videoRef}
                                    className="scanner-camera-video"
                                    autoPlay
                                    muted
                                    playsInline
                                />
                                {cameraStatus !== "ready" && (
                                    <div className="scanner-camera-placeholder">
                                        {cameraStatus === "loading" && (
                                            <>
                                                <span className="scanner-placeholder-title">
                                                    Opening camera...
                                                </span>
                                                <span className="scanner-placeholder-text">
                                                    Allow camera access to start
                                                    scanning.
                                                </span>
                                            </>
                                        )}
                                        {cameraStatus === "blocked" && (
                                            <>
                                                <span className="scanner-placeholder-title">
                                                    Camera access is blocked
                                                </span>
                                                <span className="scanner-placeholder-text">
                                                    Enable camera permission in
                                                    your browser and try again.
                                                </span>
                                                <button
                                                    type="button"
                                                    className="scanner-placeholder-btn"
                                                    onClick={restartCamera}
                                                >
                                                    Try Again
                                                </button>
                                            </>
                                        )}
                                        {cameraStatus === "unsupported" && (
                                            <>
                                                <span className="scanner-placeholder-title">
                                                    Camera not supported
                                                </span>
                                                <span className="scanner-placeholder-text">
                                                    This browser does not
                                                    support live camera access.
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="scanner-corner scanner-corner--tl" />
                                <div className="scanner-corner scanner-corner--tr" />
                                <div className="scanner-corner scanner-corner--bl" />
                                <div className="scanner-corner scanner-corner--br" />
                                <div className="scanner-scan-line" />
                                <div className="scanner-scan-grid" />
                                <div className="scanner-camera-center scanner-camera-center--overlay">
                                    <div className="scanner-camera-ring scanner-camera-ring--outer" />
                                    <div className="scanner-camera-ring scanner-camera-ring--inner" />
                                    <i className="bi bi-qr-code-scan scanner-camera-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="scanner-instruction">
                        {cameraStatus === "ready"
                            ? "Scanning for QR code..."
                            : "Starting camera..."}
                    </p>
                    <p className="scanner-supporting-text">
                        {cameraStatus === "ready"
                            ? "Position the ticket QR inside the frame. The scanner is ready to detect instantly."
                            : "Allow access so the live camera feed can appear here."}
                    </p>
                </section>

                <section className="scanner-shortcuts">
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--ghost"
                        onClick={() => {
                            setScannedTicket(defaultTicket);
                            postTicketCode(defaultTicket.ticketCode);
                        }}
                    >
                        Valid Ticket
                    </button>
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--error"
                        onClick={() => {
                            setScannedTicket(defaultTicket);
                            setTicketState("invalid");
                        }}
                    >
                        Invalid Ticket
                    </button>
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--warning"
                        onClick={() => {
                            setScannedTicket(defaultTicket);
                            setTicketState("already_checked_in");
                        }}
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
                <div
                    className="scanner-modal-backdrop"
                    onClick={closeResultModal}
                >
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
