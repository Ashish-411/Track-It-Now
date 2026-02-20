// <COMPONENT IMPORT>
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AgentLiveTrack from "./pages/AgentLiveTrack";
import CustomerTracking from "./pages/CustomerTracking";
import Error404 from "./pages/Error404";
import SingleParcel from "./pages/SingleParcel";
import ActiveDelivery from "./pages/ActiveDelivery";
import CustomerLiveTrack from "./pages/CustomerLiveTrack";
import Layout from "./components/Layout";
import MyParcels from "./pages/MyParcels";
import Help from "./pages/Help";
import Orders from "./pages/Orders";
import MyDeliveries from "./pages/MyDeliveries";
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
        <Route path="/" element={
                <ProtectedRoute allowedRoles={["customer", "agent"]}>
                    <Layout>
                        <Home/>
                    </Layout>
                </ProtectedRoute>
            }/>
        <Route path="/my-parcels" element={
          <ProtectedRoute allowedRoles={["customer"]}>
              <Layout>
                  <MyParcels/>
              </Layout>
          </ProtectedRoute>
        }/>
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={["customer"]}>
              <Layout>
                  <Orders/>
              </Layout>
          </ProtectedRoute>
        }/>
        <Route path="/my-deliveries" element={
          <ProtectedRoute allowedRoles={["agent"]}>
              <Layout>
                  <MyDeliveries/>
              </Layout>
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
        <Route path = "/agent/delivery/:tracking_code" element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <ActiveDelivery/>
          </ProtectedRoute>
          }/>
        <Route path = "/track/:tracking_code" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLiveTrack/>
          </ProtectedRoute>
          }/>
        {/* <Route path = "/broadcast" element={<Broadcast/>}/> */}
        <Route path="/help"
         element={<Help/>}/>
        <Route path = "/unauthorized" element={<Unauthorized/>}/>
        <Route path = "*" element={<Error404/>}/>   
      </Routes>
    </>
  )
}

export default App;
