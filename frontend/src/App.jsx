// <COMPONENT IMPORT>
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Notification from "./pages/Notification";
import Connection from "./components/Connection";
import Broadcast from "./components/Broadcast";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AgentLiveTrack from "./pages/AgentLiveTrack";
import CustomerTracking from "./pages/CustomerTracking";
import Error404 from "./pages/Error404";
import SingleParcel from "./pages/SingleParcel";
// </COMPONENT IMPORT>

import {Routes, Route} from "react-router-dom";
import { setupInterceptors } from "./api";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
function App() {
    const{refreshAccessToken} = useAuth();

    useEffect(() =>{
      setupInterceptors(refreshAccessToken);
    },[]);
  return (
    <>
      <Routes>
        <Route path = "/register" element={<Register/>}/>
        <Route path = "/login" element={<Login/>}/>
        <Route path = "/" element={
          <ProtectedRoute allowedRoles={["customer", "agent"]}>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path = "/connection" element={<Connection/>}/>
        <Route path = "/notification" element={
          <ProtectedRoute>
            <Notification/>
          </ProtectedRoute>
          }/>
        <Route path = "/agent-live" element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <AgentLiveTrack/>
          </ProtectedRoute>
          }/>
        <Route path="/parcel/:id" element={<SingleParcel/>}/>
        <Route path = "/customer-live/:id" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerTracking/>
          </ProtectedRoute>
          }/>
        {/* <Route path = "/broadcast" element={<Broadcast/>}/> */}
        <Route path = "/unauthorized" element={<Unauthorized/>}/>
        <Route path = "*" element={<Error404/>}/>
        
      </Routes>
    </>
  )
}

export default App;
