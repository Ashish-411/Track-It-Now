import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";
import AgentHero from "./AgentHero";
import FeatureDeliveries from "./FeatureDeliveries";
import api from "../api";
import "../styles/AgentHome.css";
import { deduplicateDeliveries } from "../utils/deliveryUtils";

function AgentHome(){
    const {logout,token, user} = useAuth();
    const navigate = useNavigate();
    const {agentDeliveries,deliveriesLoading} = useNotification(); 
    function handleClick(e){
        e.preventDefault();
        navigate("/agent-live", {state: {shouldGoLive: true}});
    }
    
    return (
        <div className="agent-content-wrapper">
            <AgentHero totalDeliveries={deliveriesLoading ? 0 : agentDeliveries.length}/>
            {/* Go Online Button */}
            <button className="go-online-btn" onClick={handleClick}>
                Go Online
            </button>
            <FeatureDeliveries deliveries={agentDeliveries} loading={deliveriesLoading}/>
        </div>
    );
}

export default AgentHome;