import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import DashNavbar from "../components/DashNavbar";
import Greetings from "../components/Greetings";
import DashStats from "../components/DashStats";
import CreateEvent from "../components/CreateEvent";
import BrowseEvent from "../components/BrowseEvent";
import BrowseEventsHead from "../components/BrowseEventsHead";
import RecentBookings from "../components/RecentBookings";
import aos from "aos";
import "aos/dist/aos.css";
import { useNavigate, useOutlet, useLocation } from "react-router-dom";
import axios from "axios";
import { ProfileContext } from "../context/ProfileContext";
import { fetchEvents } from "../utils/eventsApi";

const categoryIcons = {
    music: "bi bi-music-note-beamed",
    tech: "bi bi-laptop",
    technology: "bi bi-laptop",
    sports: "bi bi-trophy",
    arts: "bi bi-palette",
    art: "bi bi-palette",
    foods: "bi bi-cup-hot",
    food: "bi bi-cup-hot",
    "food & drinks": "bi bi-cup-hot",
};

const getCategory = (event) => event?.category || "Event";

const getCategoryIcon = (category) =>
    categoryIcons[String(category).toLowerCase()] || "bi bi-calendar-event";

const getEventTitle = (event) => event?.title || "Untitled Event";

const getVenue = (event) => {
    const location = event?.location || {};
    const parts = [
        location.venue || event?.venue,
        location.city || event?.city,
        location.state || event?.state,
        location.country || event?.country,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "Venue TBD";
};

const getEventImage = (event) => {
    return (
        event?.bannerImage ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"
    );
};

const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatPrice = (event) => {
    if (event?.isFree === true || event?.isFree === "true") return "Free";

    const prices = (Array.isArray(event?.ticketTypes) ? event.ticketTypes : [])
        .map((ticket) => Number(ticket?.ticketPrice ?? ticket?.price))
        .filter((price) => Number.isFinite(price));

    if (prices.length) return formatMoney(Math.min(...prices));
    return "Price TBD";
};

const formatEventDate = (dateTime) => {
    if (!dateTime) return "Date TBD";

    const parsed = new Date(dateTime);
    if (Number.isNaN(parsed.getTime())) return "Date TBD";

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const UserDashboard = () => {
    const { user, setUser } = useContext(ProfileContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const outlet = useOutlet({
        sidebarOpen,
        toggleSidebar: () => setSidebarOpen((prev) => !prev),
        closeSidebar: () => setSidebarOpen(false),
    });
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [userId, setUserId] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isLoadingUpcomingEvents, setIsLoadingUpcomingEvents] =
        useState(true);
    const [upcomingEventsError, setUpcomingEventsError] = useState("");

    useEffect(() => {
        aos.init({
            duration: 1000,
            once: true,
            easing: "ease-out-cubic",
            offset: 30,
        });
    }, []);

    const browseEvents = {
        padding: "3em 2em",
        display: "flex",
        flexDirection: "column",
        scrollMarginTop: "60px",
    };

    let navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        if (setUser) setUser(null);
        navigate("/signin", { replace: true });
    };

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin", { replace: true });
            return;
        }

        setIsHydrated(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setAvatar("");

        let url =
            "https://eventflow-backend-fwv4.onrender.com/api/users/dashboard";
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
            .then((res) => {
                const user = res.data.user || {};
                if (setUser) setUser(user);
                setFirstName(user.firstName || "");
                setLastName(user.lastName || "");
                setEmail(user.email || "");
                setAvatar(user.avatar || user.profilePic || "");
                setUserId(user._id || "");
                setIsVerified(user.isVerified || false);
                setIsHydrated(true);
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/signin", { replace: true });
                    return;
                }
                console.error("Error:", err.response ? err.response.data : err);
                setIsHydrated(true);
            });
    }, []);

    useEffect(() => {
        if (!user || !isHydrated) return;
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setAvatar(user.avatar || user.profilePic || "");
        setUserId(user._id || "");
        setIsVerified(user.isVerified || false);
    }, [user, isHydrated]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoadingUpcomingEvents(false);
            return;
        }

        const controller = new AbortController();
        let isActive = true;

        fetchEvents({ token, signal: controller.signal })
            .then((eventList) => {
                if (!isActive) return;
                setUpcomingEvents(eventList.slice(0, 3));
            })
            .catch((err) => {
                if (
                    err.name === "CanceledError" ||
                    err.code === "ERR_CANCELED" ||
                    !isActive
                ) {
                    return;
                }
                console.error("Error loading upcoming events:", err);
                setUpcomingEventsError("Unable to load upcoming events.");
            })
            .finally(() => {
                if (!isActive) return;
                setIsLoadingUpcomingEvents(false);
            });

        return () => {
            isActive = false;
            controller.abort();
        };
    }, []);

    return (
        <div className="dashboard-page">
            <Sidebar
                mobileOpen={sidebarOpen}
                firstName={firstName}
                lastName={lastName}
                avatar={avatar}
                onLinkClick={() => setSidebarOpen(false)}
                onLogout={handleLogout}
            />
            <div
                className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <div className="position-relative w-100">
                {outlet ? (
                    outlet
                ) : (
                    <div
                        className="dashboard-main"
                        style={{
                            marginLeft: "300px",
                            background: "rgb(249,250,251)",
                        }}
                    >
                        <DashNavbar
                            onToggleSidebar={() =>
                                setSidebarOpen((prev) => !prev)
                            }
                            isSidebarOpen={sidebarOpen}
                            firstName={firstName}
                            lastName={lastName}
                            avatar={avatar}
                        />

                        <div data-aos="fade-left">
                            <Greetings
                                firstName={firstName}
                                lastName={lastName}
                            />
                        </div>

                        {isVerified ? null : (
                            <div
                                data-aos="fade-up"
                                data-aos-delay="800"
                                className="alert alert-warning alert-dismissible fade show mx-4"
                                role="alert"
                            >
                                <strong>Verify your email!</strong> Please go to
                                your profile to verify your email.
                                <button
                                    type="button"
                                    className="btn-close shadow-none"
                                    data-bs-dismiss="alert"
                                    aria-label="close"
                                ></button>
                            </div>
                        )}
                        

                        <div className="d-flex align-items-center justify-items-between gap-3 pt-3 pb-5 mx-4 dashboard-stats">
                            <div
                                data-aos="fade-up"
                                data-aos-delay="80"
                                className="w-100"
                            >
                                <DashStats
                                    icon="bi bi-archive"
                                    icon2="bi bi-arrow-up"
                                    iconStyle={{
                                        fontSize: "1.4em",
                                        background: "rgba(0,0,256,.12)",
                                        color: "rgb(89,68,231)",
                                        padding: "5px 10px",
                                        borderRadius: "7px",
                                    }}
                                    status="3"
                                    num="5"
                                    title="Upcoming Events"
                                    statusStyle={{
                                        color: "green",
                                        background: "rgb(209,250,229)",
                                        padding: "1px 10px",
                                        borderRadius: "20px",
                                        fontWeight: "600",
                                        fontSize: ".8em",
                                    }}
                                />
                            </div>
                            <div
                                data-aos="fade-up"
                                data-aos-delay="140"
                                className="w-100"
                            >
                                <DashStats
                                    icon="bi bi-archive text-warning"
                                    iconStyle={{
                                        fontSize: "1.4em",
                                        background: "rgb(255,251,235)",
                                        padding: "5px 10px",
                                        borderRadius: "7px",
                                    }}
                                    status="Active"
                                    num="8"
                                    title="Active Tickets"
                                    statusStyle={{
                                        color: "green",
                                        background: "rgb(209,250,229)",
                                        padding: "2px 10px",
                                        borderRadius: "20px",
                                        fontWeight: "600",
                                        fontSize: ".8em",
                                    }}
                                />
                            </div>
                            <div
                                data-aos="fade-up"
                                data-aos-delay="200"
                                className="w-100"
                            >
                                <DashStats
                                    icon="bi bi-people"
                                    iconStyle={{
                                        fontSize: "1.4em",
                                        background: "rgba(27, 180, 204, 0.16)",
                                        color: "rgb(27,181,204)",
                                        padding: "5px 10px",
                                        borderRadius: "7px",
                                    }}
                                    status="All time"
                                    num="23"
                                    title="Events Attended"
                                    statusStyle={{
                                        color: "black",
                                        background: "rgb(243,244,246)",
                                        padding: "2px 10px",
                                        borderRadius: "20px",
                                        fontWeight: "600",
                                        fontSize: ".8em",
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            className="mx-4 pb-4"
                            data-aos="zoom-in-up"
                            data-aos-delay="90"
                        >
                            <CreateEvent />
                        </div>
                        <div style={browseEvents} data-aos="fade-up">
                            <BrowseEventsHead
                                style={{ fontSize: "1.5em" }}
                                title="Upcoming Events"
                                view="View all"
                            />
                            {isLoadingUpcomingEvents ? (
                                <div className="text-center py-4">
                                    <div
                                        className="spinner-border text-info"
                                        role="status"
                                        aria-hidden="true"
                                    ></div>
                                    <p className="mt-2 mb-0 text-secondary fw-semibold">
                                        Loading upcoming events...
                                    </p>
                                </div>
                            ) : upcomingEventsError ? (
                                <div
                                    className="alert alert-warning mb-0"
                                    role="alert"
                                >
                                    {upcomingEventsError}
                                </div>
                            ) : upcomingEvents.length === 0 ? (
                                <div className="text-center py-4 border rounded-4 bg-light">
                                    <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                                    <h6 className="mt-3 mb-1">
                                        No upcoming events
                                    </h6>
                                    <p className="text-secondary mb-0">
                                        New events will appear here as they are
                                        published.
                                    </p>
                                </div>
                            ) : (
                                <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
                                    {upcomingEvents.map((event, index) => {
                                        const category = getCategory(event);
                                        const eventId =
                                            event?._id ||
                                            `${category}-${index}`;

                                        return (
                                            <BrowseEvent
                                                key={eventId}
                                                img={getEventImage(event)}
                                                title={getEventTitle(event)}
                                                venue={getVenue(event)}
                                                date={formatEventDate(
                                                    event?.startDateTime,
                                                )}
                                                event={category}
                                                eventIcon={getCategoryIcon(
                                                    category,
                                                )}
                                                price={formatPrice(event)}
                                                button="Book Now"
                                                anim="fade-up"
                                                delay={(index + 1) * 70}
                                                btnStyle={{
                                                    backgroundColor:
                                                        "rgb(27,181,204)",
                                                }}
                                                onAction={() => {
                                                    localStorage.setItem(
                                                        "checkoutEvent",
                                                        JSON.stringify(event),
                                                    );
                                                    navigate(
                                                        "/dashboard/checkout",
                                                        {
                                                            state: {
                                                                event,
                                                            },
                                                        },
                                                    );
                                                }}
                                                cardTo="/dashboard/browse-event"
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div
                            style={browseEvents}
                            data-aos="fade-up"
                            data-aos-delay="80"
                        >
                            <BrowseEventsHead
                                title="My Recent Bookings"
                                style={{ fontSize: "1.3em" }}
                            />
                            <div data-aos="fade-up" data-aos-delay="140">
                                <RecentBookings />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
