import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import "./ScannerPage.css";
import { Html5Qrcode } from "html5-qrcode";

const defaultTicket = {
    attendeeName: "Full name",
    eventName: "Event name",
    ticketType: "Ticket type",
    ticketCode: "Ticket code",
    checkedInTime: "Check in time",
    ticketCount: 1,
    avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80",
};

const getDisplayTicket = (booking = {}) => {
    const user = booking?.user || {};
    const firstName =
        user?.firstName || booking?.firstName || booking?.userName || "";
    const lastName = user?.lastName || booking?.lastName || "";
    const attendeeName =
        `${firstName}${lastName ? ` ${lastName}` : ""}`.trim() ||
        booking?.userName ||
        defaultTicket.attendeeName;

    return {
        attendeeName,
        eventName:
            booking?.event?.title ||
            booking?.eventTitle ||
            booking?.eventName ||
            defaultTicket.eventName,
        ticketType:
            booking?.ticketTypeName ||
            booking?.ticketType ||
            defaultTicket.ticketType,
        ticketCode:
            booking?.ticketCode ||
            booking?.reference ||
            booking?.paymentReference ||
            defaultTicket.ticketCode,
        ticketCount:
            booking?.ticketCount ||
            booking?.quantity ||
            defaultTicket.ticketCount,
        checkedInTime:
            booking?.checkedInAt ||
            booking?.checkedInTime ||
            booking?.updatedAt ||
            defaultTicket.checkedInTime,
        avatarUrl:
            user?.profilePic ||
            user?.avatar ||
            booking?.profilePic ||
            booking?.avatar ||
            defaultTicket.avatarUrl,
    };
};

const ScannerPage = () => {
    const navigate = useNavigate();
    const [ticketState, setTicketState] = useState("idle");
    const [isSuccessFlash, setIsSuccessFlash] = useState(false);
    const [cameraStatus, setCameraStatus] = useState("loading");
    const [scannedTicket, setScannedTicket] = useState(null);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const successTimerRef = useRef(null);
    const resetTimerRef = useRef(null);
    const errorTimerRef = useRef(null);
    const scannerRef = useRef(null);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        const scanner = new Html5Qrcode("reader");

        scannerRef.current = scanner;

        let isMounted = true;
        let scannerStarted = false;

        console.log("Initializing QR code scanner...");
        scanner
            .start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    // qrbox: { width: 380, height: 380 },
                    qrbox: undefined,
                    aspectRatio: 1.0,
                    disableFlip: true,
                },
                (decodedText) => {
                    console.log("Processing flag:", isProcessingRef.current);
                    if (isProcessingRef.current) return;

                    isProcessingRef.current = true;

                    console.log("QR detected:", decodedText);
                    scanner.pause();
                    postTicketCode(decodedText);

                    // postTicketCode(decodedText).finally(() => {
                    //     setTimeout(() => {
                    //         isProcessingRef.current = false;
                    //         scanner.resume();
                    //     }, 2000);
                    // });
                },
                (err) => {
                    console.log("Scan error:", err);
                },
            )
            .then(() => {
                console.log("Scanner started successfully");
                if (!isMounted) return;

                scannerStarted = true;
                setCameraStatus("ready");
            })
            .catch((err) => {
                console.error(err);
                setCameraStatus("blocked");
            });

        return () => {
            isMounted = false;

            if (scannerStarted) {
                scanner
                    .stop()
                    .then(() => scanner.clear())
                    .catch(() => {});
            }
        };
    }, []);

    const handleConfirmCheckIn = () => {
        confirmCheckIn();
    };

    const confirmCheckIn = () => {
        if (!scannedTicket) {
            console.error("No ticket to check in");
            return;
        }

        if (isCheckingIn) {
            return;
        }

        const ticketCode =
            scannedTicket?.ticketCode ||
            scannedTicket?.reference ||
            scannedTicket?.paymentReference;
        const token = localStorage.getItem("token");

        if (!ticketCode || !token) {
            console.error("Missing ticket code or token");
            setTicketState("invalid");
            return;
        }

        setIsCheckingIn(true);

        axios
            .post(
                `${API_BASE_URL}/bookings/check-in/${ticketCode}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((res) => {
                const updatedBooking = res?.data?.booking;

                if (updatedBooking) {
                    setScannedTicket((current) => ({
                        ...current,
                        ...updatedBooking,
                        checkedIn: true,
                        checkedInAt:
                            updatedBooking.checkedInAt ||
                            new Date().toISOString(),
                        status: "checked-in",
                    }));
                }

                setTicketState("success");
                setIsSuccessFlash(true);

                if (successTimerRef.current)
                    window.clearTimeout(successTimerRef.current);
                if (resetTimerRef.current)
                    window.clearTimeout(resetTimerRef.current);

                successTimerRef.current = window.setTimeout(() => {
                    setIsSuccessFlash(false);
                }, 900);

                resetTimerRef.current = window.setTimeout(() => {
                    setTicketState("idle");
                    setIsSuccessFlash(false);
                    setScannedTicket(null);

                    // Allow the scanner to read codes again safely after auto-close
                    if (scannerRef.current) {
                        isProcessingRef.current = false;
                        scannerRef.current.resume();
                    }
                }, 3200);
            })
            .catch((err) => {
                console.error("Check-in failed:", err);
                setTicketState("invalid");
            })
            .finally(() => {
                setIsCheckingIn(false);
            });
    };

    const closeResultModal = () => {
        setTicketState("idle");
        setIsSuccessFlash(false);
        setScannedTicket(null);

        // Allow the scanner to read codes again safely
        if (scannerRef.current) {
            isProcessingRef.current = false;
            scannerRef.current.resume();
        }
    };

    const postTicketCode = (ticketCode) => {
        setTicketState("verifying");
        setScannedTicket(null);

        const normalizedCode = (ticketCode || "")
            .toString()
            .trim()
            .toUpperCase();
        console.log("Scanning ticket code:", {
            raw: ticketCode,
            normalized: normalizedCode,
        });

        const token = localStorage.getItem("token");

        // Show what's being scanned
        console.log("Sending to API:", {
            url: `${API_BASE_URL}/bookings/verify-qr`,
            payload: { ticketCode: normalizedCode },
        });

        return axios
            .post(
                `${API_BASE_URL}/bookings/verify-qr`,
                { ticketCode: normalizedCode },
                {
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : {},
                },
            )
            .then((res) => {
                const data = res?.data;

                if (!data?.booking) {
                    console.log("Response missing booking field");
                    setTicketState("invalid");
                    setErrorTimer();
                    return null;
                }

                const booking = data.booking;
                setScannedTicket({ ...booking, ticketCount: data.totalTickets || 1 });

                const status = booking.status || booking.state;

                console.log(
                    "Setting ticket state. Status:",
                    status,
                    "CheckedIn:",
                    booking.checkedIn,
                );

                if (status === "checked-in" || booking.checkedIn) {
                    console.log("Setting state to: already_checked_in");
                    setTicketState("already_checked_in");
                    setErrorTimer();
                } else {
                    console.log("Setting state to: valid");
                    setTicketState("valid");
                }

                return data;
            })
            .catch((err) => {
                console.error("Ticket verification failed:", {
                    status: err?.response?.status,
                    message: err?.response?.data?.message,
                    error: err?.message,
                });

                const status = err?.response?.status;

                if (status === 403) {
                    setTicketState("unauthorized");
                    setErrorTimer();
                    return null;
                }

                if (status === 401) {
                    setTicketState("idle");
                    return null;
                }

                // setTicketState("invalid");
                setErrorTimer();

                return null;
            });
    };

    const setErrorTimer = () => {
        if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);

        errorTimerRef.current = window.setTimeout(() => {
            setTicketState("idle");
        }, 4000);
    };

    const renderResultContent = () => {
        if (ticketState === "idle") return null;

        const ticket = getDisplayTicket(scannedTicket || defaultTicket);

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

        if (ticketState === "unauthorized") {
            return (
                <div className="scanner-result-card scanner-result-card--error">
                    <h2>Unauthorized Scanner</h2>
                    <p>This ticket belongs to another event.</p>
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
                    <div className="scanner-detail-row">
                        <span className="scanner-detail-label">
                            Number of Tickets
                        </span>
                        <span className="scanner-detail-code">
                            {ticket.ticketCount || 1}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="scanner-confirm-btn"
                    disabled={isCheckingIn}
                    onClick={handleConfirmCheckIn}
                >
                    {isCheckingIn ? (
                        <span className="scanner-btn-spinner-wrap">
                            <span
                                className="scanner-btn-spinner"
                                aria-hidden="true"
                            />
                            Confirming...
                        </span>
                    ) : (
                        "Confirm Check-In"
                    )}
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
                </header>

                <section className="scanner-stage">
                    <div className="scanner-camera-frame">
                        <div className="scanner-camera-card">
                            <div className="scanner-camera-viewfinder">
                                <div
                                    id="reader"
                                    className="scanner-reader"
                                ></div>

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
                </section>

                {/* <section className="scanner-shortcuts">
                    <button
                        type="button"
                        className="scanner-shortcut-btn scanner-shortcut-btn--ghost"
                        onClick={() => postTicketCode(defaultTicket.ticketCode)}
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
                </section> */}
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
