import Header from "../components/Header";
import AgentLiveTrack from "../pages/AgentLiveTrack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/AgentHome.css";
function AgentHome(){
    const {logout} = useAuth();
    const navigate = useNavigate();
    function handleClick(e){
        e.preventDefault();
        navigate("/agent-live", {state: {shouldGoLive: true}});
    }
 return (
        <div className="agent-home-container">
            <div className="agent-app-container">
                <Header/>
                <main className="agnet-main-content">
                    <div className="agnet-content-wrapper">
                        {/* Go Online Button */}
                        <button className="go-online-btn" onClick={handleClick}>
                            Go Online
                        </button>
                    </div>
                <button 
                    type="button" 
                    onClick={logout}
                    className="btn btn-outline">
                        Logout
                </button>
                </main>
            </div>
        </div>
    );
    
}
export default AgentHome;