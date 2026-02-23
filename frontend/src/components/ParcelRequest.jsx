import { getUserLocation } from "../utils/Location";
import api from "../api";
import { useNotification } from "../contexts/NotificationContext";
import { LuPackageOpen } from "react-icons/lu";
import "../styles/ParcelRequest.css";

function ParcelRequest({ notification }) {
    const { removeNotification } = useNotification();
  // Format the current time
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    async function handleAccept(e) {
        e.stopPropagation();

        if (!notification) {
            return;
        }
        e.currentTarget.disabled = true;

        try {
            const location = await getUserLocation();
            console.log(location);

            await api.post(`/api/parcel/accept`, {
                request_id: notification.request_id,
                receiver_location: [location.lat, location.lng],
            });
            removeNotification(notification.request_id);
        } catch (err) {
            console.error("Error accepting request:", err.message);
            e.currentTarget.disabled = false; 

        }
    }

    async function handleReject() {
        if (!notification) {
            return;
        }
        try {
            await api.post(`/api/parcel/decline/?request_id=${notification.request_id}`);
            removeNotification(notification.request_id);
        } catch (err) {
            console.error("Error rejecting request");
        }
    }

    return (
        <div className="parcel-request-card">
            <div className="parcel-request-header">
                <h3 className="parcel-request-title"><LuPackageOpen color="#F6BE00"/>   New Parcel Request</h3>
                <span className="parcel-request-badge">{currentTime}</span>
            </div>

            <div className="parcel-request-body">
                <p className="parcel-request-message">
                    {notification.message} Confirm to assign driver
                </p>

            </div>

            <div className="parcel-request-actions">
                <button className="accept-btn" onClick={handleAccept}>
                    Accept
                </button>
                <button className="decline-btn" onClick={handleReject}>
                    Decline
                </button>
            </div>
        </div>
    );
}

export default ParcelRequest;