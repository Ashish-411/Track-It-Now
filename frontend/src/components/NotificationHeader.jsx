import { useNavigate } from "react-router-dom";
import { LiaHeadsetSolid } from "react-icons/lia";
import { FaCircleArrowLeft } from "react-icons/fa6";
import "../styles/NotificationHeader.css";

function NotificationHeader({onClose}) {
    const navigate = useNavigate();

    return (
        <header className="notification-header">
            <div className="notification-header-left">
                <button 
                    className="back-button"
                    onClick={() =>{
                        if (onClose) onClose(); // close overlay if provided
                        else navigate(-1);  
                    }}
                    aria-label="Go back"
                >
                    <FaCircleArrowLeft size={24} />
                </button>
                <h1 className="notification-title">Notifications</h1>
            </div>
            
            <button 
                className="help-button"
                onClick={() => navigate("/help")}
                aria-label="Help"
            >
                <LiaHeadsetSolid size={24}/>
                <span>Help</span>
            </button>
        </header>
    );
}

export default NotificationHeader;