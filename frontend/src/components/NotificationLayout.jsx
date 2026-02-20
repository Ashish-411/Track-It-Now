import NotificationHeader from "./NotificationHeader";
import "../styles/NotificationLayout.css";

function NotificationLayout({ children, activeTab = "All", onTabChange, isOverlay = false, onClose, isAgent }) {
    return (
        <div className={isOverlay ? "notification-overlay-layout" : "layout-home-container"}>
            <div className={isOverlay ? "notification-overlay-container" : "layout-app-container"}>
                <div className="blue-section">
                    {/* pass onClose if overlay */}
                    <NotificationHeader onClose={isOverlay ? onClose : undefined} />
                    <div className="tabs-blue-container">
                        {
                            !isAgent && (
                            <div className="notification-tabs">
                                <button 
                                    className={`tab ${activeTab === "All" ? "active" : ""}`}
                                    onClick={() => onTabChange && onTabChange("All")}
                                >
                                    All
                                </button>
                                <button 
                                    className={`tab ${activeTab === "Requests" ? "active" : ""}`}
                                    onClick={() => onTabChange && onTabChange("Requests")}
                                >
                                    Requests
                                </button>
                                <button 
                                    className={`tab ${activeTab === "StatusChanged" ? "active" : ""}`}
                                    onClick={() => onTabChange && onTabChange("StatusChanged")}
                                >
                                    Status
                                </button>
                            </div>
                            )
                        }
                    </div>
                </div>
                <main className="notification-main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default NotificationLayout;
