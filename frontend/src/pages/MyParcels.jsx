import { useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";
import ParcelIcon from "../components/ParcelIcon";
import "../styles/MyParcels.css";
function MyParcels() {
    const { senderParcels, fetchSenderParcel } = useNotification();

    useEffect(() => {
        fetchSenderParcel();
    }, [fetchSenderParcel]);

    return (
  <div className="myparcels-page">
    <div className="myparcels-title">My Parcels</div>

    {senderParcels.length === 0 ? (
      <p className="myparcels-empty">No parcels found.</p>
    ) : (
      <div className="myparcels-grid">
        {senderParcels.map(parcel => (
          <ParcelIcon key={parcel.id} parcel={parcel} />
        ))}
      </div>
    )}
  </div>
);
}

export default MyParcels;
