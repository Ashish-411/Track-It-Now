import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ReceiverParcelIcon from "../components/ReceiverParcelIcon";
import { getPlaceName } from "../utils/Location";
import api from "../api";
import "../styles/Orders.css";

function formatLocation(placeObj){
  if(!placeObj) return "Unknown";
  
  const parts =[];
  if(placeObj.road) parts.push(placeObj.road);
  if(placeObj.suburb) parts.push(placeObj.suburb);

  const city = placeObj.city.replace(/\s*(Metropolitan|Sub-Metropolitan|Municipal)\s*City\s*/i, "").trim();
  if(city) parts.push (city);
  return parts.join(", ") || placeObj.full || "Unknown";

}
function Orders() {
  const { token } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if(!token) return;
    async function fetchParcels() {
      try {
        setLoading(true);
        const res = await api.get("/api/parcel/parcels?to_receive=true");
        const data = Array.isArray(res.data) ? res.data : [];
        console.log("Orders",data);
        // Resolve place names for each parcel's coordinates in parallel
        const enriched = await Promise.all(
          data.map(async (parcel) => {
            const [fromPlace, toPlace] = await Promise.all([
              parcel.source[0] && parcel.source[1]
                ? getPlaceName(parcel.source[0], parcel.source[1])
                : null,
              parcel.destination[0] && parcel.destination[1]
                ? getPlaceName(parcel.destination[0], parcel.destination[1])
                : null,
            ]);

            return {
              ...parcel,
              pickup_location:   formatLocation(fromPlace),
              delivery_location: formatLocation(toPlace),
            };
          })
        );
        setParcels(enriched? enriched : [] );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

     fetchParcels();
  }, [token]);

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      {loading && <p className="orders-state">Loading parcels...</p>}
      {error   && <p className="orders-state orders-error">{error}</p>}

      {!loading && !error && parcels.length === 0 && (
        <p className="orders-state">No incoming parcels found.</p>
      )}

      {!loading && !error && parcels.length > 0 && (
        <div className="orders-grid">
          {[...parcels].reverse().map(parcel => (
            <ReceiverParcelIcon
              key={parcel.id}
              parcel={parcel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;