import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Notification from "../pages/Notification";
import { useState , useEffect} from "react";
import "../styles/Layout.css";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

function Layout({ children }) {
    const { notifications, senderNotifications, statusNotifications, agentAssignment, deliveryAssignment } = useNotification();
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const {user}= useAuth();
    const isAgent = user?.role === "agent";
    const [notificationsViewed, setNotificationsViewed] = useState(false);

    //const isAgent = true;
    const hasNewNotifications = 
    !notificationsViewed && (
        notifications.length > 0 ||
        senderNotifications.length > 0 ||
        statusNotifications.length > 0 ||
        (isAgent && agentAssignment !== null) ||
        (deliveryAssignment && deliveryAssignment.length > 0)
    );

    const handleNotificationToggle = () => {
    setShowNotifications(prev => !prev);
    setNotificationsViewed(true);
};
useEffect(() => {
    setNotificationsViewed(false);
}, [notifications.length, senderNotifications.length, statusNotifications.length, agentAssignment, deliveryAssignment?.length])
    return (
        <div className="layout-home-container">
            <div className="layout-app-container">
                <Header 
                    onNotificationToggle={handleNotificationToggle}
                    hasNewNotifications={hasNewNotifications}
                     />

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