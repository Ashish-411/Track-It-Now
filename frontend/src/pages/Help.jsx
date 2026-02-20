import { useNavigate } from "react-router-dom";
import "../styles/Help.css";

function Help() {
    const navigate = useNavigate();

    return (
        <div className="help-root">
            {/* ── NAV ── */}
            <nav className="help-nav">
                <div className="help-nav-left">
                    <button className="help-back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>
                <div className="help-logo">Track<em>It</em>Now</div>
                <div style={{ width: 130 }} />
            </nav>

            {/* ── PAGE ── */}
            <div className="help-page">

                {/* HERO */}
                <div className="help-hero">
                    <div className="help-eyebrow">
                        <div className="help-eyebrow-dot" />
                        Support Center
                    </div>
                    <h1 className="help-hero-title">
                        How can we <em>help</em> you?
                    </h1>
                </div>

                <div className="help-divider" />

                {/* CONTACT SUPPORT */}
                <div className="help-section-head" style={{ animationDelay: ".05s" }}>
                    <div className="help-section-accent" />
                    <h2 className="help-section-title">Contact Support</h2>
                </div>

                <div className="help-contact-grid">
                    <a className="help-contact-card email" href="mailto:support@trackitnow.com" style={{ animationDelay: ".1s" }}>
                        <div className="help-cc-icon">✉️</div>
                        <div className="help-cc-title">Email Us</div>
                        <div className="help-cc-desc">
                            Send us your question and we'll respond within 24 hours with a detailed answer.
                        </div>
                        <div className="help-cc-cta">Send Email →</div>
                    </a>

                    <a className="help-contact-card phone" href="tel:+1800000000" style={{ animationDelay: ".16s" }}>
                        <div className="help-cc-icon">📞</div>
                        <div className="help-cc-title">Call Support</div>
                        <div className="help-cc-desc">
                            For urgent delivery issues, speak directly with our dedicated support team.
                        </div>
                        <div className="help-cc-cta">Call Now →</div>
                    </a>
                </div>

                {/* FOOTER BANNER */}
                <div className="help-footer-banner">
                    <div className="help-fb-left">
                        <div className="help-fb-tag">Still need help?</div>
                        <div className="help-fb-title">
                            Can't find what<br />you're looking for?
                        </div>
                        <div className="help-fb-sub">
                            Our support team is always ready to help — no matter how big or small the issue.
                            Reach out and we'll sort it out together.
                        </div>
                    </div>
                    <div className="help-fb-right">
                        <a className="help-fb-btn" href="mailto:support@trackitnow.com">
                            🎧 Talk to Support
                        </a>
                        <div className="help-fb-note">Avg. response time · under 5 min</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Help;