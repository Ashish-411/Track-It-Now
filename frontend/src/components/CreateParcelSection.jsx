import { PiPackageBold } from "react-icons/pi";
import { useState } from 'react';
import Parcel from './Parcel';
import "../styles/CreateParcelSection.css";
function CreateParcelSection(){
    const [showParcelModal, setShowParcelModal] = useState(false);
  const handleCreateClick = () => {
    setShowParcelModal(true);
  };

  const handleCloseModal = () => {
    setShowParcelModal(false);
  };

  return (
    <section className="create-parcel-section">
      <div className="create-parcel-content">
        <PiPackageBold  className="create-icon" />
        <div className="create-text">
          <h3 className="create-title">Create your parcel</h3>
          <p className="create-subtitle">Add new parcel to track</p>
        </div>
        <button onClick={handleCreateClick} className="create-btn">
         📋 Create Parcel
        </button>
      </div>

      {/* Modal Overlay - only shows when showParcelModal is true */}
      {showParcelModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Parcel handleCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </section>
  );
}
export default CreateParcelSection;