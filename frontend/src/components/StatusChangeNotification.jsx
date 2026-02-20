import "../styles/StatusChangeNotification.css";

const STATUS_CONFIG = {
    picked_up:  { color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "🚚", label: "Picked Up"  },
    in_transit: { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", icon: "🚚", label: "In Transit" },
    delivered:  { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: "✅", label: "Delivered"  },
};

function StatusChangeNotification({ assignment }) {
    const config = STATUS_CONFIG[assignment.status] ?? {
        color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", icon: "📋", label: assignment.status ?? "Update"
    };

    return (
        <div
            className="status-notif-card"
            style={{
                borderLeft:      `4px solid ${config.color}`,
                backgroundColor: config.bg,
                borderColor:     config.border,
            }}
        >
            <div className="status-notif-card__body">
                <div
                    className="status-notif-card__icon"
                    style={{ background: "#fff", boxShadow: `0 0 0 2px ${config.border}` }}
                >
                    {config.icon}
                </div>
                <div className="status-notif-card__text">
                    <p className="status-notif-card__label" style={{ color: config.color }}>
                        {config.label}
                    </p>
                    <p className="status-notif-card__message">{assignment.message}</p>
                </div>
            </div>
        </div>
    );
}

export default StatusChangeNotification;