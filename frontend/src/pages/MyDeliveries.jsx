import { useNotification } from "../contexts/NotificationContext";
import DeliveryCard from "../components/DeliveryCard";
import "../styles/MyDeliveries.css";

function MyDeliveries() {
    const { agentDeliveries, deliveriesLoading } = useNotification();
    return (
    <div className="md-page">
      <h2 className="md-title">My Deliveries</h2>

      {deliveriesLoading && (
        <div className="md-state">
          <p>Loading deliveries...</p>
        </div>
      )}
      {!deliveriesLoading && agentDeliveries.length === 0 && (
        <div className="md-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
          </svg>
          <p>No deliveries assigned yet.</p>
        </div>
      )}

      {!deliveriesLoading && agentDeliveries.length > 0 && (
        <div className="md-grid">
          {agentDeliveries.map(item => (
            <DeliveryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDeliveries;