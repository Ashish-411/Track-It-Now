import {useAuth} from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";
function ProtectedRoute({children, allowedRoles}){
    const {role, isAuthenticated} = useAuth();
    //const isAuthenticated = true
    if(isAuthenticated === null) return <div>Loading.......</div>

    if(!isAuthenticated) return <Navigate to ="/login"/>;

    if(allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to="/unauthorized"/>
    }

    return children;
}
export default ProtectedRoute;