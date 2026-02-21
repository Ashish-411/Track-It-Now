import { VscBell } from "react-icons/vsc";
import { LiaHeadsetSolid } from "react-icons/lia";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

function Header({ onNotificationToggle,hasNewNotifications  }) {
    const navigate = useNavigate();
    function handleHelpButton(e){
        e.preventDefault();
        navigate("/help");
    }
    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="app-title">Track<span className="header-focus">It</span>Now</h1>
            </div>
            <div className="header-right">
                <button className="icon-button" aria-label="Notifications" onClick={onNotificationToggle}>
                    <div style={{ position: "relative", display: "inline-flex" }}>
                        <VscBell size={24} />
                        {hasNewNotifications && (
                            <span style={{
                                position:     "absolute",
                                top:          -4,
                                right:        -4,
                                width:        9,
                                height:       9,
                                borderRadius: "50%",
                                background:   "#ef4444",
                                border:       "2px solid white",
                            }} />
                        )}
                    </div>
                </button>
                <button className="icon-button help-button" aria-label="Help">
                    <LiaHeadsetSolid size={24} onClick={handleHelpButton}/>Help
                </button>
            </div>
        </header>
    );
}

export default Header;