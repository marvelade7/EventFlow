import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const sections = [
    {
        id: "information-we-collect",
        title: "1. Information We Collect",
        content: `When you create an account or use EventFlow, we collect the following personal information:
        
• Full name (first and last name)
• Email address
• Profile picture (uploaded by you or provided via Google Sign-In)
• Payment information (for ticket purchases — note: payment processing is currently simulated and no real financial transactions occur)
• Event-related data such as events you create, book, or attend

We collect this information when you register, update your profile, create or book events, or sign in using Google.`,
    },
    {
        id: "how-we-use",
        title: "2. How We Use Your Information",
        content: `We use the information we collect to:

• Create and manage your EventFlow account
• Enable you to create, discover, and book events
• Display your profile picture and name on your dashboard and event pages
• Process ticket bookings and send confirmation details
• Send you important account-related emails (e.g. OTP verification, password reset)
• Improve our platform and user experience
• Respond to your inquiries and support requests`,
    },
    {
        id: "google-signin",
        title: "3. Google Sign-In",
        content: `EventFlow offers the option to sign in using your Google account. When you choose this option, Google shares certain information with us, including your name, email address, and profile picture.

We do not receive your Google password. The information shared by Google is used solely to create and manage your EventFlow account. Your use of Google Sign-In is also governed by Google's Privacy Policy, available at https://policies.google.com/privacy.`,
    },
    {
        id: "data-sharing",
        title: "4. Data Sharing and Third Parties",
        content: `We do not sell, rent, or trade your personal information to third parties for marketing purposes.

We share your data only in the following limited circumstances:

• Google — when you choose to sign in with Google, as described in Section 3
• Service providers — we may use trusted third-party services (such as cloud hosting and email delivery) that process your data on our behalf under strict confidentiality obligations
• Legal requirements — if required by Nigerian law, court order, or government authority

We do not share your personal data with advertisers or any other third parties beyond what is described above.`,
    },
    {
        id: "data-security",
        title: "5. Data Security",
        content: `We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse. These include:

• Password hashing using industry-standard algorithms
• JSON Web Token (JWT) authentication for secure sessions
• HTTPS encryption for data transmission

However, no method of transmission over the internet is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.`,
    },
    {
        id: "data-retention",
        title: "6. Data Retention",
        content: `We retain your personal information for as long as your account is active or as needed to provide our services. If you request deletion of your account, we will delete your personal data within a reasonable timeframe, except where we are required to retain it by law.`,
    },
    {
        id: "your-rights",
        title: "7. Your Rights",
        content: `As a user of EventFlow, you have the right to:

• Access the personal information we hold about you
• Correct inaccurate or incomplete information
• Request deletion of your account and personal data
• Withdraw consent where processing is based on consent

To exercise any of these rights, please contact us using the details provided at the end of this policy.`,
    },
    {
        id: "childrens-privacy",
        title: "8. Children's Privacy",
        content: `EventFlow is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will delete it promptly.`,
    },
    {
        id: "changes",
        title: "9. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we do, we will update the effective date at the top of this page. We encourage you to review this policy periodically. Continued use of EventFlow after any changes constitutes your acceptance of the updated policy.`,
    },
    {
        id: "contact",
        title: "10. Contact Us",
        content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:

EventFlow
Lagos, Nigeria
Email: marveladeadewuyi@gmail.com`,
    },
];

const PrivacyPolicy = () => {
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
                
                <h1 className="fw-bold mt-3 mb-2" style={{ fontSize: "1.7em" }}>
                    Privacy Policy
                </h1>
                <p className="mb-0 opacity-75">Effective Date: January 1, 2025 &nbsp;|&nbsp; Nigeria</p>
            </div>

            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3em 1.5em" }}>
                {/* Intro */}
                <div
                    className="bg-white rounded-4 shadow-sm p-4 mb-4"
                >
                    <p className="mb-0 text-secondary" style={{ lineHeight: "1.8" }}>
                        At <strong style={{ color: "rgb(226,131,8)" }}>EventFlow</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform. By using EventFlow, you agree to the practices described in this policy.
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
                        to="/terms-and-conditions"
                        style={{ color: "rgb(226,131,8)", textDecoration: "none", fontWeight: 600 }}
                    >
                        View Terms & Conditions →
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

export default PrivacyPolicy;