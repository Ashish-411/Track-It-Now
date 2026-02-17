import { VscBell } from "react-icons/vsc";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
function Header(){
    const navigate = useNavigate();
    const handleNotificationClick = (e) =>{
        e.preventDefault();
        navigate("/notification");

    }
    return(
        <header className="app-header">
            <div className="header-left">
            <h1 className="app-title">Track<span className="header-focus">It</span>Now</h1>
            </div>
            <div className="header-right">
                <button className="icon-button" aria-label="Notifications" onClick={handleNotificationClick}>
                    <VscBell size={24} />
                </button>
                <button className="icon-button help-button" aria-label="Help">
                    🎧Help
                </button>
            </div>
        </header>
    );
}
export default Header;