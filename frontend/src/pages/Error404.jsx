import { useNavigate } from "react-router-dom";
import "../styles/Error404.css";
import { useAuth } from "../contexts/AuthContext";

function Error404() {
  const navigate = useNavigate();
  const {token} = useAuth();

  return (
    <div className="e404-page">

      <div className="e404-logo">
        Track<em>It</em>Now
      </div>

      <div className="e404-illustration">
        <div className="e404-number">404</div>
        <div className="e404-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
            <path d="M11 8v4M11 15h.01"/>
          </svg>
        </div>
      </div>

      <h1 className="e404-title">Page Not Found</h1>

      <p className="e404-desc">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <button className="e404-btn" onClick={() => navigate("/")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        {
            token ? (
                "Go Back to Home"
            ):(
                "GO Back to Login"
            )
        }
      </button>

      <p className="e404-note">
        Need help? <a href="/support">Contact Support</a>
      </p>

    </div>
  );
}

export default Error404;