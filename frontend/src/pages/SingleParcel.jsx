import { useLocation } from "react-router-dom";
function SingleParcel(){
    const {state} = useLocation();
    const singleParcel = state?.parcel;
    
    if (!singleParcel) return <p>No parcel data found.</p>; 
    return(
        <>
        This is single parcel page;
        you are viewing parcel no {singleParcel.id}
        </>
    );

}
export default SingleParcel;