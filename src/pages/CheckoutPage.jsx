import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CheckoutNav from "../components/CheckoutNav";
import { ProfileContext } from "../context/ProfileContext";
import { apiUrl } from "../utils/apiConfig";

const FALLBACK_EVENT = {
    title: "Summer Beats Festival 2026",
    bannerImage:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=80&fit=crop",
    startDateTime: "2026-08-15T14:00:00",
    venue: "Madison Square Garden, NYC",
    category: "Music",
    ticketTypes: [
        {
            title: "General Admission",
            description: "Access to all stages",
            ticketPrice: 49,
        },
        {
            title: "VIP Experience",
            description: "Front row + backstage access",
            ticketPrice: 149,
        },
    ],
};

const formatDateTime = (dateTime) => {
    if (!dateTime) return "Date TBD";
    const parsed = new Date(dateTime);
    if (Number.isNaN(parsed.getTime())) return "Date TBD";

    return parsed.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(amount);

const buildDefaultQuantities = (ticketTypes) => {
    return ticketTypes.reduce((accumulator, ticket, index) => {
        accumulator[index] = index === 0 ? 1 : 0;
        return accumulator;
    }, {});
};

const isFreeEvent = (event, ticketTypes) => {
    if (event?.isFree === true || event?.isFree === "true") return true;
    if (!ticketTypes.length) return true;

    return ticketTypes.every((ticket) => {
        const price = Number(ticket?.ticketPrice ?? ticket?.price ?? 0);
        return !Number.isFinite(price) || price <= 0;
    });
};

const getStoredCheckoutEvent = () => {
    const rawEvent = localStorage.getItem("checkoutEvent");
    if (!rawEvent) return null;

    try {
        return JSON.parse(rawEvent);
    } catch (error) {
        return null;
    }
};

const getTicketTypeName = (ticket, index) =>
    ticket?.name || ticket?.title || `Ticket ${index + 1}`;

const createLocalBookingResult = (selectedEvent, total, isFree = false) => {
    const bookingReference = `EVT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const bookingData = {
        reference: bookingReference,
        eventId: selectedEvent?._id || selectedEvent?.id || null,
        eventTitle: selectedEvent?.title || FALLBACK_EVENT.title,
        total,
        createdAt: new Date().toISOString(),
        isFree,
    };

    localStorage.setItem("lastBooking", JSON.stringify(bookingData));
    return bookingData;
};

const extractUserIdentifier = (value, visited = new Set()) => {
    if (!value || typeof value !== "object") return "";
    if (visited.has(value)) return "";

    visited.add(value);

    const directKeys = ["_id", "id", "userId", "userid", "userID", "uid"];
    for (const key of directKeys) {
        const directValue = value[key];
        if (typeof directValue === "string" && directValue.trim()) {
            return directValue;
        }
        if (directValue && typeof directValue === "object") {
            const nestedIdentifier = extractUserIdentifier(directValue, visited);
            if (nestedIdentifier) return nestedIdentifier;
        }
    }

    for (const entryValue of Object.values(value)) {
        if (entryValue && typeof entryValue === "object") {
            const nestedIdentifier = extractUserIdentifier(entryValue, visited);
            if (nestedIdentifier) return nestedIdentifier;
        }
    }

    return "";
};

const getUserIdFromToken = (token) => {
    if (!token || typeof token !== "string") return "";

    try {
        const parts = token.split(".");
        if (parts.length < 2) return "";

        const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
        const payload = JSON.parse(atob(padded));

        return (
            payload?._id ||
            payload?.id ||
            payload?.userId ||
            payload?.sub ||
            payload?.user?._id ||
            payload?.user?.id ||
            payload?.user?.userId ||
            ""
        );
    } catch (error) {
        return "";
    }
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(ProfileContext);
    const eventFromState = location.state?.event || null;
    const eventFromStorage = getStoredCheckoutEvent();
    const selectedEvent = eventFromState || eventFromStorage || FALLBACK_EVENT;
    // Use the event's `ticketTypes` if it exists (even when empty). Only use
    // the fallback when the event does not provide `ticketTypes` at all.
    const ticketTypes = useMemo(() => {
        return Array.isArray(selectedEvent?.ticketTypes)
            ? selectedEvent.ticketTypes
            : FALLBACK_EVENT.ticketTypes;
    }, [selectedEvent]);
    const [quantities, setQuantities] = useState(() =>
        buildDefaultQuantities(ticketTypes),
    );
    const [paymentStatus, setPaymentStatus] = useState("idle");
    const [paymentMessage, setPaymentMessage] = useState("");
    const [paymentDetails, setPaymentDetails] = useState({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        email: localStorage.getItem("email") || "",
    });
    const [verificationStatus, setVerificationStatus] = useState("checking");
    const [verificationMessage, setVerificationMessage] = useState("");
    const [bookingUserId, setBookingUserId] = useState("");

    useEffect(() => {
        localStorage.setItem("checkoutEvent", JSON.stringify(selectedEvent));
        setQuantities(buildDefaultQuantities(ticketTypes));
    }, [selectedEvent, ticketTypes]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setVerificationStatus("blocked");
            setVerificationMessage("Sign in to continue with booking.");
            return;
        }

        setVerificationStatus("checking");
        setVerificationMessage("");

        axios
            .get(apiUrl("/users/dashboard"), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                const userData = res.data?.user || res.data?.data?.user || {};
                const isVerified = Boolean(userData?.isVerified);
                const resolvedUserId = userData?._id || userData?.id || userData?.userId || "";

                setBookingUserId(resolvedUserId);

                if (isVerified) {
                    setVerificationStatus("verified");
                    return;
                }

                setVerificationStatus("blocked");
                setVerificationMessage(
                    "Your email is not verified. Verify your email before booking events.",
                );
            })
            .catch((err) => {
                setVerificationStatus("blocked");
                if (err.response?.status === 401) {
                    setVerificationMessage("Your session expired. Sign in again to continue.");
                    return;
                }
                setVerificationMessage(
                    "Unable to verify your account right now. Please try again.",
                );
            });
    }, []);

    const subtotal = ticketTypes.reduce((total, ticket, index) => {
        const quantity = quantities[index] || 0;
        const price = Number(ticket?.ticketPrice ?? ticket?.price ?? 0);
        return total + quantity * price;
    }, 0);

    const freeEvent = isFreeEvent(selectedEvent, ticketTypes);

    const serviceFee = freeEvent ? 0 : subtotal ? subtotal * 0.1 : 0;
    const total = subtotal + serviceFee;
    const currentStep =
        paymentStatus === "success" ? 3 : paymentStatus === "processing" ? 2 : 1;
    const bookingBlocked = verificationStatus !== "verified";

    const handleQuantityChange = (index, delta) => {
        setQuantities((prev) => {
            const next = { ...prev };
            const currentValue = Number(next[index] || 0);
            const updatedValue = Math.max(currentValue + delta, 0);
            next[index] = updatedValue;
            return next;
        });
    };

    const handlePaymentChange = (field) => (event) => {
        const value = event.target.value;
        setPaymentDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const getAuthConfig = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        return {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        };
    };

    const getCurrentUserId = () => {
        const token = localStorage.getItem("token");
        const tokenUserId = getUserIdFromToken(token);

        return (
            bookingUserId ||
            user?._id ||
            user?.id ||
            user?.userId ||
            tokenUserId ||
            ""
        );
    };

    const resolveBookingUserId = () => {
        const currentUserId = getCurrentUserId();
        if (currentUserId) {
            return Promise.resolve(currentUserId);
        }

        const authConfig = getAuthConfig();
        if (!authConfig) {
            return Promise.reject(
                new Error("Your session has expired. Please sign in again."),
            );
        }

        return axios
            .get(apiUrl("/users/dashboard"), authConfig)
            .then((res) => {
                const responseData = res.data || {};
                const userData =
                    responseData?.user ||
                    responseData?.data?.user ||
                    responseData?.data ||
                    responseData?.userData ||
                    {};
                const token = localStorage.getItem("token");
                const tokenUserId = getUserIdFromToken(token);
                const resolvedUserId =
                    extractUserIdentifier(userData) ||
                    extractUserIdentifier(responseData) ||
                    tokenUserId ||
                    "";

                if (tokenUserId) {
                    console.log("Resolved booking user id from token payload.");
                }

                if (resolvedUserId) {
                    setBookingUserId(resolvedUserId);
                    return resolvedUserId;
                }

                console.error("Could not resolve booking user id from dashboard response", responseData);
                return Promise.reject(
                    new Error("Could not read your user id from the dashboard response. Please sign in again."),
                );
            });
    };

    let selectedItems = ticketTypes
        .map((ticket, index) => ({
            ticketTypeName: getTicketTypeName(ticket, index),
            quantity: Number(quantities[index] || 0),
        }))
        .filter((item) => item.quantity > 0);

    // If the event is free and has no ticketTypes, default to one free ticket
    // so the user can confirm booking without ticket selection UI.
    if (selectedItems.length === 0 && freeEvent && ticketTypes.length === 0) {
        selectedItems = [
            {
                ticketTypeName: (selectedEvent?.ticketTypes && selectedEvent.ticketTypes[0] && (selectedEvent.ticketTypes[0].name || selectedEvent.ticketTypes[0].title)) || 'Free',
                quantity: 1,
            },
        ];
    }

    const eventId = selectedEvent?._id || selectedEvent?.id;

    const checkTicketAvailability = (item) => {
        return axios.get(apiUrl("/available/check-availability"), {
            params: {
                eventId,
                ticketTypeName: item.ticketTypeName,
            },
            headers: {
                Accept: "application/json",
            },
        });
    };

    const buildInitPaymentPayload = (ticketTypeName, userId, quantity) => ({
        eventId,
        event: eventId,
        ticketTypeName,
        ticketType: ticketTypeName,
        quantity,
        user: userId,
        userId,
    });

    const buildPaymentSuccessPayload = (reference, userId, quantity) => ({
        reference,
        user: userId,
        userId,
        quantity,
    });

    const withUserHeaders = (config, userId) => ({
        ...config,
        headers: {
            ...(config?.headers || {}),
            "x-user-id": userId,
            "x-userid": userId,
        },
    });

    const createBookingByPayment = (ticketTypeName, quantity) => {
        const authConfig = getAuthConfig();
        if (!authConfig) {
            console.error("No auth config - token missing from localStorage");
            return Promise.reject(
                new Error("Your session has expired. Please sign in again."),
            );
        }

        const token = localStorage.getItem("token");
        
        const initPaymentUrl = apiUrl("/payments/initialize-payment");

        return resolveBookingUserId()
            .then((userId) => axios.post(
                initPaymentUrl,
                buildInitPaymentPayload(ticketTypeName, userId, quantity),
                withUserHeaders(authConfig, userId),
            ))
            .then((initRes) => {
                console.log("Initialize payment response:", initRes.data);
                const reference = initRes.data?.reference;
                if (!reference) {
                    return Promise.reject(new Error("Payment reference was not returned."));
                }

                const successUrl = apiUrl("/bookings/payment/success");

                return resolveBookingUserId().then((userId) => axios.post(
                    successUrl,
                    buildPaymentSuccessPayload(reference, userId, quantity),
                    withUserHeaders(authConfig, userId),
                ));
            })
            .catch((err) => {
                throw err;
            })
            .then((res) => res.data?.bookings || (res.data ? [res.data] : []));
    };

    const createBookingsForItem = (item) => {
        return createBookingByPayment(item.ticketTypeName, item.quantity);
    };

    const createAllBookings = () => {
        return selectedItems.reduce((chain, item) => {
            return chain.then((allBookings) => {
                return createBookingsForItem(item).then((itemBookings) => {
                    return [...allBookings, ...itemBookings];
                });
            });
        }, Promise.resolve([]));
    };

    const normalizeErrorMessage = (err) => {
        return (
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong while processing your booking."
        );
    };

    const handlePaymentSubmit = (event) => {
        event.preventDefault();

        if (!freeEvent && !subtotal) {
            setPaymentStatus("error");
            setPaymentMessage("Select at least one ticket before continuing.");
            return;
        }

        if (bookingBlocked) {
            setPaymentStatus("error");
            setPaymentMessage(
                verificationMessage ||
                    "Only users with verified email can complete bookings.",
            );
            return;
        }

        if (!selectedItems.length) {
            setPaymentStatus("error");
            setPaymentMessage("Select at least one ticket before continuing.");
            return;
        }

        if (!eventId) {
            const localBooking = createLocalBookingResult(selectedEvent, total, freeEvent);
            setPaymentStatus("success");
            setPaymentMessage(
                freeEvent
                    ? `Free booking confirmed. Reference ${localBooking.reference}.`
                    : `Payment approved. Booking reference ${localBooking.reference}.`,
            );
            return;
        }

        if (!getAuthConfig()) {
            setPaymentStatus("error");
            setPaymentMessage("Your session has expired. Please sign in again.");
            return;
        }

        setPaymentStatus("processing");
        setPaymentMessage(
            freeEvent ? "Confirming free booking..." : "Processing payment...",
        );

        const availabilityPromise = freeEvent
            ? Promise.resolve([])
            : Promise.all(selectedItems.map((item) => checkTicketAvailability(item)));

        availabilityPromise
            .then((availabilityResponses) => {
                if (!freeEvent) {
                    const unavailable = availabilityResponses.find((response, index) => {
                        const remaining = Number(response?.data?.remaining ?? 0);
                        return remaining < selectedItems[index].quantity;
                    });

                    if (unavailable) {
                        return Promise.reject(
                            new Error(
                                "Some selected tickets are no longer available in the requested quantity.",
                            ),
                        );
                    }
                }

                return createAllBookings();
            })
            .then((bookings) => {
                const firstBooking = bookings[0] || {};
                const bookingReference =
                    firstBooking.reference ||
                    firstBooking.ticketCode ||
                    firstBooking._id ||
                    `EVT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

                localStorage.setItem(
                    "lastBooking",
                    JSON.stringify({
                        reference: bookingReference,
                        eventId,
                        eventTitle: selectedEvent?.title || FALLBACK_EVENT.title,
                        total,
                        createdAt: new Date().toISOString(),
                        bookingCount: bookings.length,
                        isFree: freeEvent,
                    }),
                );

                setPaymentStatus("success");
                setPaymentMessage(
                    freeEvent
                        ? `Free booking confirmed (${bookings.length} ticket${bookings.length > 1 ? "s" : ""}). Reference ${bookingReference}.`
                        : `Payment approved (${bookings.length} ticket${bookings.length > 1 ? "s" : ""}). Reference ${bookingReference}.`,
                );
            })
            .catch((err) => {
                setPaymentStatus("error");
                setPaymentMessage(normalizeErrorMessage(err));
            });
    };

    const handleBackToEvents = () => {
        navigate(-1);
    };

    const selectedCount = ticketTypes.reduce(
        (count, ticket, index) => count + (quantities[index] || 0),
        0,
    );

    return (
        <div
            className="create-event-main checkout-page pb-1"
            style={{
                marginLeft: "300px",
                background: "rgb(249,250,251)",
                minHeight: "100vh",
            }}
        >
            <CheckoutNav title="Checkout Page" />
            <div
                className="d-flex align-items-start gap-4 checkout-layout"
                style={{ margin: "40px auto", width: "70%" }}
            >
                <div className="d-flex flex-column gap-4 checkout-left" style={{ width: "62%" }}>
                    <div className="d-flex align-items-center gap-3 shadow-sm py-4 px-4 rounded-3 bg-white">
                        <img
                            src={selectedEvent?.bannerImage || FALLBACK_EVENT.bannerImage}
                            alt={selectedEvent?.title || FALLBACK_EVENT.title}
                            style={{ width: "100px", height: "80px", objectFit: "cover", borderRadius: "12px" }}
                        />
                        <div>
                            <h5 className="m-0">{selectedEvent?.title || FALLBACK_EVENT.title}</h5>
                            <p className="m-0">{formatDateTime(selectedEvent?.startDateTime || FALLBACK_EVENT.startDateTime)}</p>
                            <p className="m-0">{selectedEvent?.venue || FALLBACK_EVENT.venue}</p>
                        </div>
                    </div>

                    <form id="checkout-payment-form" onSubmit={handlePaymentSubmit} className="d-flex flex-column gap-3 shadow-sm py-4 px-4 rounded-3 bg-white">
                        <div>
                            <h5 className="mb-1">Select Tickets</h5>
                            <p className="text-secondary mb-0">
                                {freeEvent
                                    ? "This is a free event. Select tickets and confirm your booking."
                                    : "Choose your tickets and complete the simulated payment below."}
                            </p>
                        </div>

                        {ticketTypes.map((ticket, index) => {
                            const price = Number(ticket?.ticketPrice ?? ticket?.price ?? 0);
                            const quantity = quantities[index] || 0;

                            return (
                                <div key={`${ticket?.title || "ticket"}-${index}`} className="d-flex align-items-center justify-content-between border rounded-3 py-3 px-3">
                                    <div>
                                        <h6 className="mb-1">{ticket?.title || `Ticket ${index + 1}`}</h6>
                                        <p className="mb-2">{ticket?.description || "Standard event access"}</p>
                                        <p style={{ color: "rgb(223,127,7)" }} className="m-0 fs-5 fw-bold">{formatMoney(price)}</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(index, -1)}
                                            className="btn btn-light border-secondary fs-5 py-0 px-2 fw-semibold"
                                        >
                                            -
                                        </button>
                                        <p className="m-0 fw-semibold">{quantity}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(index, 1)}
                                            className="btn btn-light border-secondary fs-5 py-0 px-2 fw-semibold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {freeEvent ? (
                            <div className="alert alert-success mb-0" role="alert">
                                No payment needed for this event.
                            </div>
                        ) : (
                            <div className="row g-3 mt-1">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Cardholder name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={paymentDetails.cardName}
                                        onChange={handlePaymentChange("cardName")}
                                        placeholder="Alex Johnson"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={paymentDetails.email}
                                        onChange={handlePaymentChange("email")}
                                        placeholder="alex@example.com"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Card number</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="form-control"
                                        value={paymentDetails.cardNumber}
                                        onChange={handlePaymentChange("cardNumber")}
                                        placeholder="4242 4242 4242 4242"
                                        maxLength="19"
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Expiry</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={paymentDetails.expiry}
                                        onChange={handlePaymentChange("expiry")}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">CVC</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="form-control"
                                        value={paymentDetails.cvc}
                                        onChange={handlePaymentChange("cvc")}
                                        placeholder="123"
                                        maxLength="4"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {verificationStatus === "checking" ? (
                            <div className="alert alert-info mb-0" role="alert">
                                Checking account verification...
                            </div>
                        ) : null}

                        {verificationStatus === "blocked" ? (
                            <div className="alert alert-warning mb-0" role="alert">
                                {verificationMessage}
                            </div>
                        ) : null}

                        {paymentMessage ? (
                            <div
                                className={`alert mb-0 ${paymentStatus === "success"
                                    ? "alert-success"
                                    : paymentStatus === "error"
                                        ? "alert-danger"
                                        : "alert-info"
                                    }`}
                                role="alert"
                            >
                                {paymentMessage}
                            </div>
                        ) : null}

                        {paymentStatus === "success" ? (
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard/tickets")}
                                    className="btn btn-dark fw-semibold px-3 py-2"
                                >
                                    View Tickets
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className="btn btn-outline-secondary fw-semibold px-3 py-2"
                                >
                                    Back to dashboard
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleBackToEvents}
                                    className="btn btn-outline-secondary fw-semibold px-3 py-2"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    style={{ backgroundColor: "rgb(223,127,7)", fontSize: "1.05em" }}
                                    className="btn py-2 px-3 rounded-3 text-white fw-semibold"
                                    disabled={paymentStatus === "processing" || bookingBlocked}
                                >
                                    {paymentStatus === "processing"
                                        ? "Processing..."
                                        : freeEvent
                                            ? "Confirm Booking"
                                            : "Continue to Payment"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                <div style={{ position: "sticky", top: "70px", width: "38%"  }} className="d-flex flex-column gap-3 shadow-sm py-4 px-3 rounded-3 bg-white checkout-right">
                    <h5>Order Summary</h5>
                    {ticketTypes.map((ticket, index) => {
                        const quantity = quantities[index] || 0;
                        if (!quantity) return null;

                        const price = Number(ticket?.ticketPrice ?? ticket?.price ?? 0);

                        return (
                            <div key={`summary-${ticket?.title || "ticket"}-${index}`} className="d-flex align-items-center justify-content-between">
                                <p className="m-0">{ticket?.title || `Ticket ${index + 1}`} x {quantity}</p>
                                <p className="m-0 fw-semibold">{formatMoney(price * quantity)}</p>
                            </div>
                        );
                    })}
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0">Service fee</p>
                        <p className="m-0 fw-semibold">{formatMoney(serviceFee)}</p>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 fs-5 fw-semibold">Total</p>
                        <p style={{ color: "rgb(223,127,7)" }} className="m-0 fw-semibold fs-5">{formatMoney(total)}</p>
                    </div>
                    <p className="text-secondary mb-0">
                        {selectedCount} ticket{selectedCount === 1 ? "" : "s"} selected.
                    </p>
                    <button
                        type="submit"
                        form="checkout-payment-form"
                        style={{ backgroundColor: "rgb(223,127,7)", fontSize: "1.05em" }}
                        className="btn py-2 px-3 rounded-3 text-white fw-semibold mt-2"
                        disabled={paymentStatus === "processing" || bookingBlocked}
                    >
                        {paymentStatus === "processing"
                            ? "Processing..."
                            : paymentStatus === "success"
                                ? freeEvent
                                    ? "Booking confirmed"
                                    : "Payment completed"
                                : freeEvent
                                    ? "Confirm free booking"
                                    : "Pay now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
