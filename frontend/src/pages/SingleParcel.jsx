import { useLocation, useNavigate, useParams} from "react-router-dom";
import "../styles/SingleParcel.css";
import { getPlaceName } from "../utils/Location"; 
import { useState,useEffect } from "react";


// Derive step state from current_status
function getStepState(stepStatus, currentStatus) {
    const order = ["created", "picked_up", "in_transit", "delivered"];
    const current = order.indexOf(currentStatus);
    const step    = order.indexOf(stepStatus);
    

    if (step < current)  return "done";
    if (step === current) return "active";
    return "future";
}


function SingleParcel() {
    const { id }      = useParams();
    const { state }   = useLocation();
    const navigate    = useNavigate();
    const [pickupPlace, setPickupPlace] = useState("");
    const [dropoffPlace, setDropoffPlace] = useState("");
    const singleParcel = state?.parcel;

    useEffect(() => {
    const fetchPlaces = async () => {
        if (!singleParcel) return;

        try {
            if (singleParcel.source) {
                const place = await getPlaceName(
                    singleParcel.source[0],
                    singleParcel.source[1]
                );
            setPickupPlace(
            place.road
                ? `${place.road}, ${place.suburb || place.city}`
                : place.suburb || place.city || place.full
            );            }

            if (singleParcel.destination) {
                const place = await getPlaceName(
                    singleParcel.destination[0],
                    singleParcel.destination[1]
                );
            setDropoffPlace(
                        place.road
                            ? `${place.road}, ${place.suburb || place.city}`
                            : place.suburb || place.city || place.full
                        );                }

        } catch (err) {
            console.error("Geocoding failed", err);
        }
    };

    fetchPlaces();
}, [singleParcel]);


    if (!singleParcel) return (
        <div className="sp-error">
            <p>No parcel data found.</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );

    const status = singleParcel.current_status ?? "created";

    const formatDate = (ds) => {
        const d = new Date(ds);
        return {
            date: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        };
    };

    const created = formatDate(singleParcel.created_at);
    const updated = formatDate(singleParcel.updated_at);

    const steps = [
        { key: "created",    label: "Created",    icon: "✓",  activeIcon: "📦" },
        { key: "picked_up",  label: "Picked Up",  icon: "✓",  activeIcon: "📤" },
        { key: "in_transit", label: "In Transit", icon: "✓",  activeIcon: "🚚" },
        { key: "delivered",  label: "Delivered",  icon: "✓",  activeIcon: "🏠" },
    ];

    const timeline = [
        { label: "Parcel Created",       time: `${created.date} · ${created.time}`, state: "done"  },
        { label: "Picked Up by Agent",   time: status === "created" ? "Pending…" : `${updated.date}`, state: status === "created" ? "pending" : "done"   },
        { label: "In Transit",           time: status === "in_transit" || status === "delivered" ? `${updated.date} · ${updated.time}` : "Pending…", state: status === "in_transit" ? "active" : status === "delivered" ? "done" : "pending" },
        { label: "Delivered",            time: status === "delivered" ? `${updated.date} · ${updated.time}` : "Pending…", state: status === "delivered" ? "done" : "pending" },
    ];

    const handleSearchAgents = () => {
        navigate(`/customer-live/${id}`, {
            state: { parcel: singleParcel, source: singleParcel.source, destination: singleParcel.destination }
        });
    };

    const statusLabel = status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="sp-root">
            {/* ── TOP BAR ── */}
            <div className="sp-topbar">
                <button className="sp-back-btn" onClick={() => navigate(-1)}>← Back</button>
                <div className={`sp-status-badge ${status}`}>
                    <span className="sp-pulse-dot" />
                    {statusLabel}
                </div>
            </div>

            <div className="sp-inner">
                {/* ── HERO ── */}
                <div className="sp-hero">
                    <div className="sp-hero-left">
                        <div className="sp-hero-eyebrow">Parcel Identifier</div>
                        <div className="sp-hero-id"><em>#</em>{singleParcel.id}</div>

                        {/* Step tracker */}
                        <div className="sp-steps">
                            {steps.map((s, i) => {
                                const st = getStepState(s.key, status);
                                return (
                                    <>
                                        <div className="sp-step" key={s.key}>
                                            <div className={`sp-step-circle ${st}`}>
                                                {st === "done" ? "✓" : st === "active" ? s.activeIcon : "○"}
                                            </div>
                                            <div className={`sp-step-lbl ${st}`}>{s.label}</div>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`sp-step-line ${getStepState(steps[i + 1].key, status) !== "future" || st === "done" ? "done" : ""}`} key={`line-${i}`} />
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    </div>

                    {/* ETA card */}
                    <div className="sp-hero-right">
                        <div className="sp-eta-label">Status</div>
                        <div className="sp-eta-val">{statusLabel}</div>
                        <div className="sp-eta-date">{updated.date}</div>
                        <div className="sp-eta-divider" />
                        <div className="sp-eta-status">
                            <span className="sp-pulse-dot" />
                            Live Tracking
                        </div>
                    </div>
                </div>

                {/* ── MAIN GRID ── */}
                <div className="sp-main-grid">

                    {/* LEFT */}
                    <div className="sp-left-col">

                        {/* Description */}
                        <div className="sp-card" style={{ animationDelay: ".1s" }}>
                            <div className="sp-card-header">
                                <div className="sp-card-title">
                                    <div className="sp-card-title-icon" style={{ background: "#f0f2ff" }}>📝</div>
                                    Parcel Description
                                </div>
                            </div>
                            <div className="sp-card-body">
                                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>
                                    {singleParcel.description || "No description provided"}
                                </p>
                            </div>
                        </div>

                        {/* Route map */}
                        <div className="sp-card" style={{ animationDelay: ".18s" }}>
                            <div className="sp-card-header">
                                <div className="sp-card-title">
                                    <div className="sp-card-title-icon" style={{ background: "#f0f7ff" }}>🗺️</div>
                                    Route Overview
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, background: "var(--blue-lt)", color: "var(--blue)", padding: "4px 12px", borderRadius: 20, letterSpacing: ".05em", textTransform: "uppercase" }}>
                                    Live
                                </span>
                            </div>

                            {/* Decorative map canvas */}
                            <div className="sp-map-canvas">
                                <svg viewBox="0 0 600 160" preserveAspectRatio="none">
                                    <path d="M80,130 C160,130 200,40 520,36"
                                        stroke="#1e40ff" strokeWidth="2.5" fill="none"
                                        strokeDasharray="8 5" opacity=".5" />
                                </svg>
                                <div className="sp-map-pin from">
                                    <div className="sp-map-pin-dot" />
                                    <div className="sp-map-pin-label">📍 {pickupPlace || "Loading location..."}</div>
                                </div>
                                <div className="sp-map-pin to">
                                    <div className="sp-map-pin-dot" />
                                    <div className="sp-map-pin-label">🎯 {dropoffPlace || "Loading location..."}</div>
                                </div>
                                <div className="sp-map-truck">🚚</div>
                            </div>

                            {/* Coord chips */}
                            <div style={{ padding: "0 20px 18px" }}>
                                <div className="sp-coord-row">
                                    <div className="sp-coord-chip">
                                        <div className="sp-coord-icon from">📍</div>
                                        <div>
                                            <div className="sp-coord-lbl">Pickup</div>
                                            <div className="sp-coord-val">
                                                {pickupPlace || "Loading location..."}
                                            </div>

                                        </div>
                                    </div>
                                    <div className="sp-coord-chip">
                                        <div className="sp-coord-icon to">🎯</div>
                                        <div>
                                            <div className="sp-coord-lbl">Dropoff</div>
                                            <div className="sp-coord-val">
                                                {dropoffPlace ||"Loading Location.."}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="sp-card" style={{ animationDelay: ".26s" }}>
                            <div className="sp-card-header">
                                <div className="sp-card-title">
                                    <div className="sp-card-title-icon" style={{ background: "#fef9f0" }}>📅</div>
                                    Timestamps
                                </div>
                            </div>
                            <div className="sp-card-body">
                                <div className="sp-info-row">
                                    <div className="sp-info-item">
                                        <span className="sp-info-label">Created</span>
                                        <div className="sp-date-main">{created.date}</div>
                                        <div className="sp-date-time">{created.time}</div>
                                    </div>
                                    <div className="sp-info-item">
                                        <span className="sp-info-label">Last Updated</span>
                                        <div className="sp-date-main">{updated.date}</div>
                                        <div className="sp-date-time">{updated.time}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="sp-right-col">

                        {/* Parties */}
                        <div className="sp-card" style={{ animationDelay: ".14s" }}>
                            <div className="sp-card-header">
                                <div className="sp-card-title">
                                    <div className="sp-card-title-icon" style={{ background: "#f0fff8" }}>👥</div>
                                    Parties
                                </div>
                            </div>
                            <div className="sp-card-body">
                                <div className="sp-people">
                                    <div className="sp-person-row">
                                        <div className="sp-person-avatar sender">📤</div>
                                        <div>
                                            <div className="sp-person-role">Sender</div>
                                            <div className="sp-person-id">#{singleParcel.sender_id}</div>
                                        </div>
                                    </div>
                                    <div className="sp-person-row">
                                        <div className="sp-person-avatar receiver">📥</div>
                                        <div>
                                            <div className="sp-person-role">Receiver</div>
                                            <div className="sp-person-id">#{singleParcel.receiver_id}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="sp-card" style={{ animationDelay: ".22s" }}>
                            <div className="sp-card-header">
                                <div className="sp-card-title">
                                    <div className="sp-card-title-icon" style={{ background: "#fdf4ff" }}>📋</div>
                                    Activity Timeline
                                </div>
                            </div>
                            <div className="sp-card-body">
                                <div className="sp-timeline">
                                    {timeline.map((t, i) => (
                                        <div className="sp-tl-item" key={i}>
                                            <div className="sp-tl-left">
                                                <div className={`sp-tl-dot ${t.state}`}>
                                                    {t.state === "done" ? "✓" : t.state === "active" ? "🚚" : "○"}
                                                </div>
                                                <div className={`sp-tl-line ${t.state === "done" ? "done" : ""}`} />
                                            </div>
                                            <div className="sp-tl-content">
                                                <div className={`sp-tl-title ${t.state === "pending" ? "pending" : ""}`}>{t.label}</div>
                                                <div className="sp-tl-time">{t.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sp-actions">
                            <button className="sp-btn-primary" onClick={handleSearchAgents}
                            disabled={singleParcel.current_status === "assigned"}
                            style={{ 
                                opacity: singleParcel.current_status === "assigned" ? 0.5 : 1,
                                cursor:  singleParcel.current_status === "assigned" ? "not-allowed" : "pointer",
                            }} >
                                🤝 Search Agents
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleParcel;