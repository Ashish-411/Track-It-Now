import "../styles/ParcelAccept.css";

function ParcelAccept({ notification }) {
    return (
        <div className="parcel-accept-card" >
            {/* Top green stripe */}
            <div className="parcel-accept-card__stripe" />

            {/* Body */}
            <div className="parcel-accept-card__body">
                {/* Icon */}
                <div className="parcel-accept-card__icon">
                    📦
                </div>

                {/* Text */}
                <div className="parcel-accept-card__text">
                    <p className="parcel-accept-card__label">New Parcel</p>
                    <p className="parcel-accept-card__message">{notification.message}</p>
                </div>
            </div>
        </div>
    );
}

export default ParcelAccept;