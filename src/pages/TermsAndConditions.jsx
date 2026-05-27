import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const sections = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: `By accessing or using the EventFlow platform, you confirm that you are at least 18 years of age, have read and understood these Terms and Conditions, and agree to be bound by them.

If you do not agree with any part of these terms, you must not use our platform.`,
    },
    {
        id: "account",
        title: "2. Your Account",
        content: `To use most features of EventFlow, you must create an account. You are responsible for:

• Providing accurate and truthful information during registration
• Keeping your login credentials secure and confidential
• All activity that occurs under your account
• Notifying us immediately of any unauthorized use of your account

EventFlow reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`,
    },
    {
        id: "event-hosts",
        title: "3. Event Hosts",
        content: `If you create events on EventFlow, you agree to:

• Provide accurate, complete, and truthful information about your event including title, description, date, time, venue, and pricing
• Ensure your event complies with all applicable Nigerian laws and regulations
• Not create events that are fraudulent, misleading, illegal, or harmful
• Take full responsibility for the events you organize and their outcomes
• Honour ticket purchases and provide the experience advertised

EventFlow reserves the right to remove any event that violates these terms without prior notice.`,
    },
    {
        id: "ticket-booking",
        title: "4. Ticket Booking and Payments",
        content: `When you book a ticket on EventFlow:

• You agree to pay the price listed for the ticket at the time of booking
• Payment information you provide must be accurate and valid
• All ticket purchases are subject to availability

Please note: EventFlow is currently in a simulated payment environment. No real financial transactions are processed at this time. This notice will be updated when live payment processing is activated.

EventFlow is not responsible for events that are cancelled, postponed, or fail to meet expectations. Any refund or dispute must be resolved directly with the event host.`,
    },
    {
        id: "prohibited",
        title: "5. Prohibited Conduct",
        content: `You agree not to use EventFlow to:

• Create fake, fraudulent, or misleading events
• Impersonate another person or organization
• Upload content that is offensive, defamatory, or violates any law
• Attempt to gain unauthorized access to other accounts or our systems
• Scrape, copy, or redistribute our platform's content without permission
• Use the platform for any illegal purpose under Nigerian law
• Harass, abuse, or harm other users

Violation of these rules may result in immediate account termination.`,
    },
    {
        id: "intellectual-property",
        title: "6. Intellectual Property",
        content: `All content on the EventFlow platform — including but not limited to the logo, design, code, and text — is owned by EventFlow and protected by applicable intellectual property laws.

You may not reproduce, distribute, or create derivative works from our content without our express written permission.

Content you upload (such as event banners and profile pictures) remains yours. By uploading it, you grant EventFlow a non-exclusive licence to display it on the platform for the purpose of providing our services.`,
    },
    {
        id: "third-party",
        title: "7. Third-Party Services",
        content: `EventFlow integrates with Google for authentication purposes. Your use of Google Sign-In is governed by Google's own Terms of Service and Privacy Policy.

We are not responsible for the practices, content, or availability of any third-party services linked to or integrated with our platform.`,
    },
    {
        id: "disclaimer",
        title: "8. Disclaimer of Warranties",
        content: `EventFlow is provided on an "as is" and "as available" basis. We do not guarantee that the platform will be error-free, uninterrupted, or free of harmful components.

We make no warranties — express or implied — regarding the accuracy, reliability, or completeness of any content on the platform.`,
    },
    {
        id: "liability",
        title: "9. Limitation of Liability",
        content: `To the fullest extent permitted by Nigerian law, EventFlow and its founders shall not be liable for:

• Any indirect, incidental, or consequential damages arising from your use of the platform
• Loss of data, revenue, or profits
• Events that are cancelled, postponed, or fail to meet expectations
• Any disputes between event hosts and attendees

Your sole remedy for dissatisfaction with the platform is to stop using it.`,
    },
    {
        id: "governing-law",
        title: "10. Governing Law",
        content: `These Terms and Conditions are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of Nigerian courts.`,
    },
    {
        id: "changes",
        title: "11. Changes to These Terms",
        content: `We reserve the right to update or modify these Terms and Conditions at any time. Changes will be effective upon posting to this page with an updated effective date. Your continued use of EventFlow after changes are posted constitutes your acceptance of the revised terms.

We encourage you to review these terms periodically.`,
    },
    {
        id: "contact",
        title: "12. Contact Us",
        content: `If you have any questions or concerns about these Terms and Conditions, please contact us at:

EventFlow
Lagos, Nigeria
Email: marveladeadewuyi@gmail.com`,
    },
];

const TermsAndConditions = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "rgb(249,250,251)" }}>
            <Navbar />
            {/* Header */}
            <div
                style={{
                    background: 'white',
                    padding: ".7em 2em",
                    textAlign: "center",
                    padding: ".7em 2em",
                    position: "sticky",
                    top: '80px',
                    zIndex: 100,
                    textAlign: "center",
                    color: "rgb(226,131,8)",
                    maxWidth: "800px",
                    margin: "20px auto",
                }}
                className="shadow-sm rounded-3"
            >
                {/* <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                    <h2 className="fw-bold mb-0">EventFlow</h2>
                </Link> */}
                <h1 className="fw-bold  mb-2" style={{ fontSize: "1.7em" }}>
                    Terms & Conditions
                </h1>
                <p className="mb-0 opacity-75">Effective Date: January 1, 2025 &nbsp;|&nbsp; Nigeria</p>
            </div>

            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3em 1.5em" }}>
                {/* Intro */}
                <div
                    className="bg-white rounded-4 shadow-sm p-4 mb-4"
                >
                    <p className="mb-0 text-secondary" style={{ lineHeight: "1.8" }}>
                        Welcome to <strong style={{ color: "rgb(226,131,8)" }}>EventFlow</strong>. These Terms and Conditions govern your use of our platform and constitute a legally binding agreement between you and EventFlow. Please read them carefully before using our services.
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                    <h5 className="fw-semibold mb-3">Table of Contents</h5>
                    <ol className="mb-0" style={{ lineHeight: "2" }}>
                        {sections.map((s) => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    style={{ color: "rgb(226,131,8)", textDecoration: "none" }}
                                >
                                    {s.title.replace(/^\d+\.\s/, "")}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Sections */}
                {sections.map((section) => (
                    <div
                        key={section.id}
                        id={section.id}
                        className="bg-white rounded-4 shadow-sm p-4 mb-4"
                        style={{ scrollMarginTop: "20px" }}
                    >
                        <h5 className="fw-semibold mb-3" style={{ color: "rgb(226,131,8)" }}>
                            {section.title}
                        </h5>
                        <p
                            className="text-secondary mb-0"
                            style={{ whiteSpace: "pre-line", lineHeight: "1.9" }}
                        >
                            {section.content}
                        </p>
                    </div>
                ))}

                {/* Footer nav */}
                <div className="text-center mt-5">
                    <Link
                        to="/privacy-policy"
                        style={{ color: "rgb(226,131,8)", textDecoration: "none", fontWeight: 600 }}
                    >
                        View Privacy Policy →
                    </Link>
                    <br />
                    <Link
                        to="/"
                        className="text-secondary mt-3 d-inline-block"
                        style={{ textDecoration: "none" }}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;