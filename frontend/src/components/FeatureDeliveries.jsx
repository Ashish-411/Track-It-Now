import { useNavigate } from "react-router-dom";
import DeliveryCard from "./DeliveryCard";
import "../styles/FeatureDeliveries.css";

function FeatureDeliveries({ deliveries = [], loading }) {
  const navigate = useNavigate();
  const featured = deliveries.slice(0, 2);

  return (
    <div className="fd-box">
      <div className="fd-header">
        <h3 className="fd-title">My Deliveries</h3>
        <button
          className="fd-view-btn"
          onClick={() => navigate("/my-deliveries", { state: { deliveries } })}
        >
          View All →
        </button>
      </div>

      {loading ? (
        <p className="fd-empty">Loading...</p>
      ) : featured.length === 0 ? (
        <p className="fd-empty">No deliveries yet</p>
      ) : (
        <div className="fd-grid">
          {featured.map(item => (
            <DeliveryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeatureDeliveries;