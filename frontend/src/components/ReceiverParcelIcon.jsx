import "../styles/ReceiverParcelIcon.css";

const STATUS_CONFIG = {
  created:    { label: "Created",    color: "#64748b", dot: false },
  picked_up:  { label: "Picked Up",  color: "#f59e0b", dot: false },
  in_transit: { label: "In Transit", color: "#00a864", dot: true  },
  delivered:  { label: "Delivered",  color: "#3b82f6", dot: false },
};

const STEPS = ["created", "picked_up", "in_transit", "delivered"];
const STEP_LABELS = ["Created", "Picked Up", "In Transit", "Delivered"];

function getStepState(stepKey, currentStatus) {
  const stepIdx    = STEPS.indexOf(stepKey);
  const currentIdx = STEPS.indexOf(currentStatus);
  if (stepIdx < currentIdx)  return "done";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

function getLineState(lineIndex, currentStatus) {
  const currentIdx = STEPS.indexOf(currentStatus);
  if (lineIndex < currentIdx - 1) return "done";
  if (lineIndex === currentIdx - 1) return "dashed";
  return "pending";
}

function ReceiverParcelIcon({ parcel, onClick }) {
  const status   = parcel.status || "created";
  const config   = STATUS_CONFIG[status] || STATUS_CONFIG.created;
  const dateStr  = parcel.created_at
    ? new Date(parcel.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long" })
    : "—";

  return (
    <div className="pc-block" onClick={onClick}>

      {/* TOP ROW */}
      <div className="pc-top-row">
        <div className="pc-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
          </svg>
        </div>

        <div className="pc-top-info">
          <div className="pc-id">#{parcel.description}</div>
          <div className="pc-meta">
            <span className="pc-date">{dateStr}</span>
            <span className="pc-sep"></span>
            <span className="pc-status" style={{ color: config.color }}>
              {config.dot && (
                <span className="pc-status-dot" style={{ background: config.color }} />
              )}
              {config.label}
            </span>
          </div>
        </div>

        <div className="pc-chevron">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      {/* STEPPER */}
      <div className="pc-stepper">
        {STEPS.map((step, i) => {
          const state = getStepState(step, status);
          return (
            <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "0" }}>
              <div className={`pc-dot ${state}`}>
                {state === "done" && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
                {state === "active" && (
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="#152968"><circle cx="4" cy="4" r="4"/></svg>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`pc-line ${getLineState(i, status)}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* STEP LABELS */}
      <div className="pc-labels">
        {STEPS.map((step, i) => {
          const state = getStepState(step, status);
          return (
            <div key={step} className="pc-label">
              <span className={`pc-label-text ${state}`}>{STEP_LABELS[i]}</span>
            </div>
          );
        })}
      </div>

      {/* ROUTE */}
      <div className="pc-route">
        <div>
          <div className="pc-route-lbl">From</div>
          <div className="pc-route-val">{parcel.pickup_location || "—"}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="pc-route-lbl">To</div>
          <div className="pc-route-val">{parcel.delivery_location || "—"}</div>
        </div>
      </div>

    </div>
  );
}

export default ReceiverParcelIcon;