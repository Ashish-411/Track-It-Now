import { useParams } from "react-router-dom";
import CustomerMap from "../components/CustomerMap";
import { IoMdClose } from "react-icons/io";
import { useNavigate} from "react-router-dom";

function CustomerTracking() {
  const {id} = useParams();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "1rem",
        background: "#2196F3",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Request Pickup</h2>
          <p style={{ margin: "0.5rem 0 0 0" }}>
            Parcel ID: {id || "NEW"}
          </p>
        </div>

        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "2rem",
            padding: "0.5rem"
          }}
        >
          <IoMdClose />
        </button>
      </div>

      {/* Map Component */}
      <CustomerMap parcelId={id}/>
    </div>
  );
}

export default CustomerTracking;