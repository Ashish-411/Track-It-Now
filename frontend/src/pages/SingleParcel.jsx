import { useLocation,useNavigate ,useParams } from "react-router-dom";
import "../styles/SingleParcel.css";
function SingleParcel(){
    const {id} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();
    const singleParcel = state?.parcel;
    
    if (!singleParcel) return (
        <div className="single-parcel-error">
            <p>No parcel data found.</p>
            <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    ); 
    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };   
    const handleTrackLive = () => {
        navigate(`/customer-live/${id}`, { 
            state: { 
                parcel: singleParcel,
                source: singleParcel.source,
                destination: singleParcel.destination
            } 
        });
    };
    return (
        <div className="single-parcel-container">
            <div className="single-parcel-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1 className="single-parcel-title">Parcel Details</h1>
            </div>

            <div className="single-parcel-card">
                {/* Parcel ID Banner */}
                <div className="parcel-id-banner">
                    <div className="parcel-id-large">Parcel Id#: {singleParcel.id}</div>
                    <span className={`parcel-status-large ${singleParcel.current_status?.toLowerCase().replace(' ', '-')}`}>
                        {singleParcel.current_status || 'Pending'}
                    </span>
                </div>

                {/* Parcel Info Grid */}
                <div className="parcel-info-grid">
                    {/* Description */}
                    <div className="info-section">
                        <h3 className="info-section-title">Description</h3>
                        <p className="info-section-content description-content">
                            {singleParcel.description || 'No description provided'}
                        </p>
                    </div>

                    {/* Location Details */}
                    <div className="info-section">
                        <h3 className="info-section-title">Pickup Location</h3>
                        <div className="location-details">
                            <div className="location-coords">
                                <span className="coord-label">Latitude:</span> {singleParcel.source?.lat?.toFixed(4)}
                            </div>
                            <div className="location-coords">
                                <span className="coord-label">Longitude:</span> {singleParcel.source?.lng?.toFixed(4)}
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3 className="info-section-title">Dropoff Location</h3>
                        <div className="location-details">
                            <div className="location-coords">
                                <span className="coord-label">Latitude:</span> {singleParcel.destination?.lat?.toFixed(4)}
                            </div>
                            <div className="location-coords">
                                <span className="coord-label">Longitude:</span> {singleParcel.destination?.lng?.toFixed(4)}
                            </div>
                        </div>
                    </div>

                    {/* Sender/Receiver Info */}
                    <div className="info-section">
                        <h3 className="info-section-title">Sender ID</h3>
                        <p className="info-section-content">#{singleParcel.sender_id}</p>
                    </div>

                    <div className="info-section">
                        <h3 className="info-section-title">Receiver ID</h3>
                        <p className="info-section-content">#{singleParcel.receiver_id}</p>
                    </div>

                    {/* Timestamps */}
                    <div className="info-section">
                        <h3 className="info-section-title">Created</h3>
                        <p className="info-section-content timestamp">
                            <span className="timestamp-icon">📅</span> 
                            {formatDate(singleParcel.created_at)}
                        </p>
                    </div>

                    <div className="info-section">
                        <h3 className="info-section-title">Last Updated</h3>
                        <p className="info-section-content timestamp">
                            <span className="timestamp-icon">🕒</span> 
                            {formatDate(singleParcel.updated_at)}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="parcel-actions">
                    <button className="track-live-btn" onClick={handleTrackLive}>
                        <span className="live-icon">🏍️</span>
                            Search Agents
                    </button>
                </div>
            </div>
        </div>
    );

}
export default SingleParcel;