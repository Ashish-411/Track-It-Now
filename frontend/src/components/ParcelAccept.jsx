import { useNavigate } from "react-router-dom";

function ParcelAccept({ notification }) {
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();
        navigate(`/parcel/${notification.id}`, { state: { parcel: notification } });
    }

    return (
        <div
            style={{ border: "1px solid green", padding: "10px", margin: "10px", cursor: "pointer" }}
            onClick={handleClick}>
            <p>{notification.message}</p> {/* 👈 just the message */}
        </div>
    );
}
export default ParcelAccept;