function AgentNotificationIcon({ assignment }) {
    return (
        <>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(60px); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
                    50%      { box-shadow: 0 0 0 8px rgba(34,197,94,0);  }
                }
                .agent-notification {
                    display:       flex;
                    align-items:   center;
                    gap:           12px;
                    background:    #fff;
                    border-left:   4px solid #22c55e;
                    border-radius: 12px;
                    padding:       14px 16px;
                    margin:        10px 0;
                    box-shadow:    0 4px 16px rgba(0,0,0,0.08);
                    animation:     slideIn 0.4s ease forwards;
                    position:      relative;
                    overflow:      hidden;
                }
                .agent-notification::before {
                    content:    "";
                    position:   absolute;
                    top: 0; left: 0;
                    width:      100%;
                    height:     100%;
                    background: linear-gradient(135deg, rgba(34,197,94,0.05) 0%, transparent 60%);
                    pointer-events: none;
                }
                .agent-notif-dot {
                    width:         12px;
                    height:        12px;
                    border-radius: 50%;
                    background:    #22c55e;
                    flex-shrink:   0;
                    animation:     pulse 1.8s infinite;
                }
                .agent-notif-body {
                    flex: 1;
                }
                .agent-notif-label {
                    font-size:   11px;
                    font-weight: 700;
                    color:       #16a34a;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin:      0 0 4px;
                }
                .agent-notif-message {
                    font-size:   14px;
                    color:       #111827;
                    font-weight: 500;
                    margin:      0;
                }
                .agent-notif-icon {
                    font-size: 26px;
                }
            `}</style>

            <div className="agent-notification">
                <span className="agent-notif-icon">🚴</span>
                <div className="agent-notif-body">
                    <p className="agent-notif-label">Delivery Assigned</p>
                    <p className="agent-notif-message">{assignment.message}</p>
                </div>
                <div className="agent-notif-dot" />
            </div>
        </>
    );
}

export default AgentNotificationIcon;