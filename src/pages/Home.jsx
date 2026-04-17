import React, { useEffect, useRef } from "react";
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

const Home = () => {
    const navigate = useNavigate();

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
                    filterEvent={{ backgroundColor: "rgb(234, 238, 246)" }}
                />
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
                    <BrowseEvent
                        img="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"
                        title="Summer Beats Festival 2025"
                        venue="Madison Square Garden"
                        date="August 15, 2026"
                        event="Music"
                        eventIcon="bi bi-music-note-beamed"
                        anim='fade-up'
                        cardTo="/signup"
                        showActionButton={false}
                    />

                    <BrowseEvent
                        img="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop"
                        title="Tech Conference 2025"
                        venue="Convention Center"
                        date="September 10, 2026"
                        event="Tech"
                        eventIcon="bi bi-laptop"
                        anim='fade-up'
                        cardTo="/signup"
                        showActionButton={false}
                    />

                    <BrowseEvent
                        img="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop"
                        title="Brooklyn Gourmet Night Market"
                        venue="Prospect Park"
                        date="Jul 28, 2026"
                        event="Food"
                        eventIcon="bi bi-laptop"
                        anim='fade-up'
                        cardTo="/signup"
                        showActionButton={false}
                    />
                </div>
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
