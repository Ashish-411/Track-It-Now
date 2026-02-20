import { useNavigate } from "react-router-dom";
import ParcelIcon from "./ParcelIcon";
import "../styles/FeatureParcel.css";

function FeatureParcel({ parcels = [] }) {
  const navigate = useNavigate();

  const featured = parcels.slice(0, 2); // first 2 parcels

  return (
    <div className="feature-box">
      
      {/* Header */}
      <div className="feature-header">
        <h3>My Parcels</h3>

        <button
          className="view-btn"
          onClick={() => navigate("/my-parcels")}
        >
          View All →
        </button>
      </div>

      {/* Content */}
      {featured.length === 0 ? (
        <p className="feature-empty">No parcels yet</p>
      ) : (
        <div className="feature-grid">
          {featured.map(parcel => (
            <ParcelIcon key={parcel.id} parcel={parcel} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeatureParcel;
