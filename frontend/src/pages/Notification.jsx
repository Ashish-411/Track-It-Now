import { useNotification } from "../contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ParcelRequest from "../components/ParcelRequest";
import ParcelAccept from "../components/ParcelAccept";
import AgentNotificationIcon from "../components/AgentNotificationIcon";
import AgentAssignment from "../components/AgentAssignment";
import StatusChangeNotification from "../components/StatusChangeNotification";
import NoNotifications from "../components/NoNotifications";
import NotificationLayout from "../components/NotificationLayout";
import "../styles/Notification.css"
function Notification({ isOverlay = false, onClose }){
    const {notifications,senderNotifications, fetchSenderParcel, statusNotifications, agentAssignment, deliveryAssignment } = useNotification();
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState("All");


    useEffect(() => {
        if(user?.role ==="agent") return;
        fetchSenderParcel();
    }, [fetchSenderParcel]);

    const isAgent = user?.role === "agent";

    const hasNotifications = 
        notifications.length > 0 || 
        senderNotifications.length > 0 ||
        statusNotifications.length > 0 ||
        (isAgent && agentAssignment !== null) ||
        (deliveryAssignment && deliveryAssignment.length > 0);


    const hasRequests = 
    notifications.some(n => n.type === "parcel_request") ||
    senderNotifications.length > 0 ||
    (deliveryAssignment && deliveryAssignment.length > 0) ||
    (isAgent && agentAssignment !== null);

    const hasStatusChanged = statusNotifications.length > 0;


    const renderRequests = () => (
    <>
        {[...notifications].reverse().map((n, index) => {
            if (n.type === "parcel_request") {
                return <ParcelRequest key={index} notification={n} />;
            }
            return null;
        })}
        {[...senderNotifications].reverse().map((sn, index) => (
            <ParcelAccept key={index} notification={sn} />
        ))}
        {[...deliveryAssignment ?? []].reverse().map((d, index) => (
            <AgentAssignment key={index} assignment={d} />
        ))}
        {isAgent && agentAssignment && (
            <AgentNotificationIcon assignment={agentAssignment} />
        )}
    </>
);

const renderStatusChanged = () => (
    <>
        {[...statusNotifications].reverse().map((n, index) => (
            <StatusChangeNotification key={index} assignment={n} />
        ))}
    </>
);

    const renderAll = () => (
        <>
            {renderRequests()}
            {renderStatusChanged()}
        </>
    );
return (
    <NotificationLayout 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
           isOverlay={isOverlay}
          onClose={onClose}
          isAgent = {isAgent}
          >
        <div className="notifications-list">
            {activeTab === "All" && (
                hasNotifications ? renderAll() : <NoNotifications />
            )}
            {!isAgent && activeTab === "Requests" && (
                hasRequests ? renderRequests() : <NoNotifications />
            )}
            {!isAgent && activeTab === "StatusChanged" && (
                hasStatusChanged ? renderStatusChanged() : <NoNotifications />
            )}
        </div>
    </NotificationLayout>
);
}
export default Notification;