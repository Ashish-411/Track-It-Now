import { MdHome } from "react-icons/md";
import { LuPackage } from "react-icons/lu";
import { LuPackageOpen } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import "../styles/NavBar.css";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get current location
    const { logout , user} = useAuth();
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const { clearAgentStorage, clearSenderNotifications, clearDeliveryAssignment } = useNotification();
    const accountRef = useRef(null);
    const isAgent =user?.role === "agent";

    useEffect(() => {
        function handleClickOutside(event) {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setShowAccountPopup(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        setShowAccountPopup(false); // Close popup when navigating
    };

    const handleLogout = () => {
    if (isAgent) {
        // Clear all agent-side storage
        clearAgentStorage();
    } else {
        // Clear all customer-side storage
        clearSenderNotifications();
        clearDeliveryAssignment();
    }
    logout();
    navigate("/login");
    setShowAccountPopup(false);
};

    // Helper function to check if a path is active
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <nav className="navbar">
                {/* Home Button */}
                <button
                    onClick={() => handleNavigation("/")}
                    className={`nav-button ${isActive("/") ? "active" : ""}`}
                >
                    <MdHome size={24} />
                    <span className="nav-label">Home</span>
                </button>

                {/* My Parcels Button */}
                {
                    !isAgent ? (
                        <>
                            <button
                                onClick={() => handleNavigation("/my-parcels")}
                                className={`nav-button ${isActive("/my-parcels") ? "active" : ""}`}
                            >
                                <LuPackage size={24} />
                                <span className="nav-label">My Parcels</span>
                            </button>

                            <button
                                onClick={() => handleNavigation("/orders")}
                                className={`nav-button ${isActive("/orders") ? "active" : ""}`}
                            >
                                <LuPackageOpen size={24} />
                                <span className="nav-label">Orders</span>
                            </button>
                        </>
                    ):(
                        <button
                            onClick={() => handleNavigation("/my-deliveries")}
                            className={`nav-button ${isActive("/my-deliveries") ? "active" : ""}`}
                        >
                            <TbTruckDelivery  size={24} />
                            <span className="nav-label">My Deliveries</span>
                        </button>
                    )
                }

                {/* Account Button with Popup */}
                <div ref={accountRef} className="account-container">
                    <button
                        onClick={() => setShowAccountPopup(!showAccountPopup)}
                        className={`nav-button ${isActive("/profile") || isActive("/settings") ? "active" : ""}`}
                    >
                        <IoPersonOutline size={24} />
                        <span className="nav-label">Account</span>
                    </button>

                    {/* Account Popup Menu - Only Logout Button */}
                    {showAccountPopup && (
                        <div className="account-popup">
                            <button
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Add padding to the bottom of the page to prevent content from being hidden behind the navbar */}
            <div className="navbar-spacer" />
        </>
    );
}

export default NavBar;