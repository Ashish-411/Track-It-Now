import { IoMdNotificationsOff } from "react-icons/io";
import "../styles/NoNotifications.css";

function NoNotifications() {
    return (
        <div className="no-notifications-container">
            <div className="no-notifications-icon">
                <IoMdNotificationsOff size={100} />
            </div>
            <h2 className="no-notifications-title">All Caught UP !</h2>
            <p className="no-notifications-message">
                You have no notifications right now. We'll let you know when there's any update on your shipments.
            </p>
        </div>
    );
}

export default NoNotifications;