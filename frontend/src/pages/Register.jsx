import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Register.css";
import api from "../api";

function Register() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [activeTab, setActiveTab] = useState("customer"); // Track active tab
    
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const payload = {
                name,
                email,
                password,
                role:activeTab,
            };
            const res = await api.post("/api/auth/register",payload);

            console.log(res.data);
            setName("");
            setPassword("");
            setEmail("");
        }catch(err){
            console.log(err);
        }
    };
    

    return (
        <div className="register-page">
                <div className="register-container">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h1 className="register-title">Create Your Account</h1>
                        
                        <div className="tab-navigation">
                            <div className="tabs-container">
                                <button 
                                    type="button" 
                                    className={`tab-btn ${activeTab === "customer" ? "active" : ""}`}
                                    onClick={() => handleTabClick("customer")}
                                >
                                    Register as a User
                                </button>
                                <button 
                                    type="button" 
                                    className={`tab-btn ${activeTab === "agent" ? "active" : ""}`}
                                    onClick={() => handleTabClick("agent")}
                                >
                                    Register as an Agent
                                </button>
                                <div className="tab-indicator" data-active={activeTab}></div>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="form-input"
                                required 
                            />
                            
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="form-input"
                                required 
                            />
                            
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password (min. 8 characters)"
                                className="form-input"
                                required 
                                minLength="8"
                            />
                            
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Create Account</button>
                            <NavLink to = "/login" className="nav-link-login">
                                <button type="button" className="btn-secondary">
                                    Already have an account? <span>Login</span>
                                </button>
                            </NavLink>
                        </div>
                    </form>
                </div>
        </div>
    );
}

export default Register;