import { useState, useEffect } from "react";
import api from "../api";
import { useRequest } from "../contexts/RequestContext";
import { useAuth } from "../contexts/AuthContext";
import { IoClose } from "react-icons/io5";
import { getUserLocation } from "../utils/Location";
import "../styles/Parcel.css";
function Parcel({handleCloseModal}){
    const [description,setDescription] = useState("");
    const [email,setEmail] = useState("");
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const {requestData,setRequest} = useRequest();
    const {token,user} = useAuth();

    useEffect(() => {
    getUserLocation()
        .then((loc) => setUserLocation(loc))
        .catch((err) => console.log("Location error:", err));
}, []);
   async function handleSubmit(e){
        e.preventDefault();
        if(!user){
            alert("user not loaded yet");
            return;
        }
        if(!userLocation){
            alert("location not loaded");
            return;
        }
        console.log("current user", user);
        setLoading(true);
        setError("");

        try{
            const response = await api.post("/api/parcel/request",{
                parcel_description: description,
                receiver_email: email,
                sender_location: userLocation ? [userLocation.lat,userLocation.lng] : [],
                
            });
            console.log("request response", response);
            const request_data = response.data;
            setRequest(request_data);
            alert("Parcel request sent successfully!");
            handleCloseModal(false); 
        }catch(err){
            console.log(err);
            setError(err.response?.data?.message || "Failed to send parcel");
        }finally{
            setLoading(false);
        }
    }
    return(
        
            <div className="parcel-modal">
                <div className="parcel-modal-header">
                    <h2 className="parcel-modal-title">Create New Parcel</h2>
                    <button className="parcel-close-btn" onClick={() => handleCloseModal(false)}>
                        <IoClose size={24} />
                    </button>
                </div>

                {error && <div className="parcel-error">{error}</div>}

                <form onSubmit={handleSubmit} className="parcel-form">
                    <div className="parcel-form-group">
                        <label className="parcel-label">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Enter parcel description"
                            className="parcel-input"
                        />
                    </div>

                    <div className="parcel-form-group">
                        <label className="parcel-label">Receiver Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Receiver Email"
                            className="parcel-input"
                        />
                    </div>

                    <div className="parcel-modal-actions">
                        <button
                            type="button"
                            className="parcel-btn parcel-btn-secondary"
                            onClick={() => handleCloseModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="parcel-btn parcel-btn-primary"
                        >
                            {loading ? "Creating..." : "Create Parcel"}
                        </button>
                    </div>
                </form>
            </div>
    );
}
export default Parcel;