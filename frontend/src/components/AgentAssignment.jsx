import { useState } from "react";

function AgentAssignment({ assignment }) {
    const [copied, setCopied] = useState(false);
    const displayName = assignment.agent_name 
        ? `${assignment.agent_name} has been assigned to you`
        : assignment.message;

    const handleCopy = () => {
        navigator.clipboard.writeText(assignment.tracking_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <style>
                    {`
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
            `}
            </style>
            <div
                onClick={handleCopy}
                style={{
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)",
                    padding: "16px 20px",
                    maxWidth: "400px",
                    border: "1px solid #e5e7eb",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    position: "relative",
                    overflow: "hidden",
                    animation: "slideIn 0.3s ease-out",
                }}
                title="Click to copy tracking code"
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)";
                }}
            >
                {/* Decorative accent bar */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                    }}
                />

                {/* Icon and content */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    {/* Notification icon */}
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#eff6ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#3b82f6",
                            fontSize: "18px",
                            flexShrink: 0,
                        }}
                    >
                        👤
                    </div>

                    {/* Main content */}
                    <div style={{ flex: 1 }}>
                        <p style={{
                            margin: "0 0 4px 0",
                            color: "#1f2937",
                            fontSize: "14px",
                            fontWeight: "500",
                        }}>
                            {displayName}
                        </p>

                        <p style={{
                            margin: "8px 0 4px 0",
                            color: "#6b7280",
                            fontSize: "12px",
                            fontWeight: "400",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}>
                            Tracking Code:
                        </p>

                        <h2 style={{
                            margin: 0,
                            color: "#1f2937",
                            fontSize: "24px",
                            fontWeight: "600",
                            fontFamily: "monospace",
                            letterSpacing: "0.5px",
                        }}>
                            {assignment.tracking_code}
                        </h2>
                        {copied && (
                            <div
                                style={{
                                    marginTop: "8px",
                                    padding: "6px 12px",
                                    backgroundColor: "#f0fdf4",
                                    borderRadius: "20px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "1px solid #bbf7d0",
                                    animation: "fadeIn 0.2s ease forwards",
                                }}
                            >
                                <span style={{ color: "#22c55e", fontSize: "16px" }}>✓</span>
                                <span style={{ 
                                    color: "#166534", 
                                    fontSize: "13px", 
                                    fontWeight: "500",
                                }}>
                                    Copied to clipboard!
                                </span>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default AgentAssignment;