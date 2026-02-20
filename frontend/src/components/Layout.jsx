import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Notification from "../pages/Notification";
import { useState } from "react";
import "../styles/Layout.css";
import { useAuth } from "../contexts/AuthContext";

function Layout({ children }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const {user}= useAuth();
    const isAgent = user?.role === "agent";
    //const isAgent = true;

    return (
        <div className="layout-home-container">
            <div className="layout-app-container">
                <Header onNotificationToggle={() => setShowNotifications(prev => !prev)} />

                {/* Backdrop */}
                {showNotifications && (
                    <div
                        onClick={() => setShowNotifications(false)}
                        style={{
                            position:     "absolute",
                            inset:        0,
                            zIndex:       998,
                            background:   "rgba(0,0,0,0.35)",
                            backdropFilter: "blur(2px)",
                            borderRadius: "inherit",
                        }}
                    />
                )}

                {/* Notification panel — sibling of main, inside layout-app-container */}
                {showNotifications && (
                    <Notification
                        isOverlay
                        onClose={() => setShowNotifications(false)}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                )}

                <main  className={`layout-main-content ${isAgent ? "agent" : ""}`}>
                    {children}
                </main>
                <NavBar />
            </div>
        </div>
    );
}

export default Layout;