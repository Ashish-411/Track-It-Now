import { getUserLocation } from "../utils/Location";
import api from "../api";
import { useNotification } from "../contexts/NotificationContext";
function ParcelRequest({notification}){
    const {removeNotification} = useNotification();
    async function handleAccept() {
    if(!notification){
        return;
    }
    try {
      const location = await getUserLocation();
      console.log(location);

      await api.post(`/api/parcel/accept`, {
        request_id: notification.request_id,
        receiver_location: [location.lat, location.lng],
      });
      removeNotification(notification.request_id);

    } catch (err) {
      console.error("Error accepting request:", err.message);
    }
  }

  async function handleReject() {
    if(!notification){
        return;
    }
    try {
      await api.post(`/api/parcel/decline/?request_id=${notification.request_id}`);
      removeNotification(notification.request_id);


    } catch (err) {
      console.error("Error rejecting request");
    }
  }
    return(
        <div>
            <h2>Parcel Request</h2>
                <div key={notification.request_id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
                    <p><strong>{notification.message}</strong></p> <br/>        
                        <>
                            <button onClick={() => handleAccept()}>
                                Accept
                            </button>
      
                            <button onClick={() => handleReject()}>
                                Reject
                            </button>
                        </>
                </div> 
        </div>
    );
}
export default ParcelRequest;