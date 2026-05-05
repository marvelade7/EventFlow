import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BrowseEvent from "../components/BrowseEvent";
import HowItWorks from "../components/HowItWorks";
import HostEvent from "../components/HostEvent";
import Footer from "../components/Footer";
import BrowseEventsHead from "../components/BrowseEventsHead";
import BrowseEventsFilter from "../components/BrowseEventsFilter";
import aos from "aos";
import "aos/dist/aos.css";
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

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [eventsError, setEventsError] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        aos.init({ 
            duration: 1500,
            once: true, 
        });
    }, []);

    const heroRef = useRef(null);
    const browseRef = useRef(null);
    const howItWorksRef = useRef(null);
    const contactRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({
            behavior: "smooth",
        });
    };

    const section = {
        scrollMarginTop: "60px",
    };

    const browseEvents = {
        backgroundColor: "white",
        padding: "5em 8em",
        display: "flex",
        flexDirection: "column",
        scrollMarginTop: "60px",
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const controller = new AbortController();
        let isActive = true;

        fetchEvents({ token, signal: controller.signal })
            .then((eventList) => {
                if (!isActive) return;
                setEvents(eventList);
            })
            .catch((err) => {
                if (err.name === "CanceledError" || err.code === "ERR_CANCELED" || !isActive) {
                    return;
                }
                console.error("Error fetching landing page events:", err);
                setEventsError("Unable to load events right now.");
            })
            .finally(() => {
                if (!isActive) return;
                setIsLoadingEvents(false);
            });

        return () => {
            isActive = false;
            controller.abort();
        };
    }, []);

    const categories = useMemo(() => {
        const eventCategories = events.map((event) => getCategory(event));
        return ["All", ...new Set(eventCategories)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        if (activeCategory === "All") return events;
        return events.filter((event) => getCategory(event) === activeCategory);
    }, [activeCategory, events]);

    const featuredEvents = filteredEvents.slice(0, 3);

    return (
        <>
            <Navbar data-aos="slide-down"
                scrollToHero={() => {
                    scrollToSection(heroRef);
                }}
                scrollToBrowse={() => {
                    scrollToSection(browseRef);
                }}
                scrollToWorks={() => {
                    scrollToSection(howItWorksRef);
                }}
                scrollToContact={() => {
                    scrollToSection(contactRef);
                }}
            />
            <section style={section} ref={heroRef}>
                <Hero
                    onBrowseEvents={() => scrollToSection(browseRef)}
                    onCreateEvent={() => navigate("/signup")}
                />
            </section>

            <section
                data-aos="fade-up"
                ref={browseRef}
                className="browse-events"
                style={browseEvents}
            >
                <BrowseEventsHead
                    title="What's Happening Near You"
                    view="View all"
                    onViewAll={() => navigate("/signup")}
                />
                <BrowseEventsFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onFilterSelect={setActiveCategory}
                    filterEvent={{ backgroundColor: "rgb(234, 238, 246)" }}
                />
                {isLoadingEvents ? (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-info"
                            role="status"
                            aria-hidden="true"
                        ></div>
                        <p className="mt-2 mb-0 text-secondary fw-semibold">
                            Loading events...
                        </p>
                    </div>
                ) : eventsError ? (
                    <div className="alert alert-warning mb-0" role="alert">
                        {eventsError}
                    </div>
                ) : featuredEvents.length === 0 ? (
                    <div className="text-center py-5 border rounded-4 bg-light">
                        <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                        <h6 className="mt-3 mb-1">No events found</h6>
                        <p className="text-secondary mb-0">
                            Try another category or check back later.
                        </p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
                        {featuredEvents.map((event, index) => {
                            const category = getCategory(event);
                            const eventId = event?._id || `${category}-${index}`;

                            return (
                                <BrowseEvent
                                    key={eventId}
                                    img={getEventImage(event)}
                                    title={getEventTitle(event)}
                                    venue={getVenue(event)}
                                    date={formatEventDate(event?.startDateTime)}
                                    event={category}
                                    eventIcon={getCategoryIcon(category)}
                                    price={formatPrice(event)}
                                    anim="fade-up"
                                    delay={index * 70}
                                    cardTo="/signup"
                                    showActionButton={false}
                                />
                            );
                        })}
                    </div>
                )}
            </section>

            <section data-aos="fade-up" style={section} ref={howItWorksRef}>
                <HowItWorks />
            </section>

            <section data-aos="fade-up" style={section}>
                <HostEvent onStartFree={() => navigate("/signup")} />
            </section>

            <section data-aos="fade-up" style={section} ref={contactRef}>
                <Footer onSubscribe={() => navigate("/signup")} />
            </section>
        </>
    );
};

export default Home;
