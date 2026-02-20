import { NavLink } from "react-router-dom";
import "../styles/Unauthorized.css"; // Regular CSS import
import { useAuth } from "../contexts/AuthContext";
function Unauthorized() {
    const {token} = useAuth();
  return (
    <div className="unauth-container">
      <div className="unauth-logo">
        Track<em>It</em>Now
      </div>

      <div className="unauth-card">
        <div className="unauth-icon-wrap">🔒</div>
        <div className="unauth-code">403 · Unauthorized</div>
        <div className="unauth-title">Access Denied</div>
        <div className="unauth-desc">
          You don't have permission to view this page. Please log in with an
          authorized account to continue.
        </div>
        {
            token ? (
            <NavLink to="/">
            <button className="unauth-btn-primary">Back to Home</button>
            </NavLink>
            ):(
                <NavLink to="/login">
                <button className="unauth-btn-primary">Back to Login</button>
                </NavLink>
            )
        }
      </div>

      <div className="unauth-footer-note">
        Need help? <a href="#">Contact Support</a>
      </div>
    </div>
  );
}

export default Unauthorized;
