import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "../styles/ParcelIcon.css"
function ParcelIcon({parcel}){
    const navigate = useNavigate();
    function handleClick(e){
        e.preventDefault();
        navigate(`/parcel/${parcel.id}`,{state:{parcel: parcel}});
    }
    // Format the created_at date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };
        return (
        <div className="parcelCard" onClick={handleClick}>
        {/* Parcel Icon */}
        <div className="parcelIcon">
            <div className="parcelBox"></div>
            <span className="parcelLabel">PARCEL</span>
        </div>

        {/* Content */}
        <div className="parcelContent">
            <div className="parcelId">
            {parcel.id}
            <span className="statusBadge">
                {parcel.current_status || 'Pending'}
            </span>
            </div>
            
            <div className="parcelDescription">
            {parcel.description || 'No description provided'}
            </div>
            
            <div className="parcelFooter">
            <div className="timeInfo">
                <span className="timeIcon">📦</span>
                {formatDate(parcel.created_at)}
            </div>
            
            <div className="onWay">
                On the way • {new Date(parcel.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            </div>
        </div>
        {/* Right arrow */}
        <div className="arrowIcon">
            <MdOutlineKeyboardArrowRight />
        </div>
        </div>
    );
}
export default ParcelIcon;