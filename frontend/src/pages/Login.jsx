import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Login.css";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const {login,refreshAccessToken} = useAuth();
    const navigate = useNavigate();
    //handleSubmit
    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append("username",email);
            formData.append("password",password);
            const res = await api.post(
                "/api/auth/login",
                formData,
                {
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded",
                        
                    },
                }
            );
            console.log(res.data);
            login({access_token:res.data.access_token});
            navigate("/");
        }catch(err){
        if (err.response && err.response.status === 401) {
            alert("Invalid email or password");
            return; // stop execution
        }

        // other server errors
        if (err.response) {
            alert(err.response.data.detail || "Login failed");
            return;
        }
        // network error
        alert("Server unreachable. Try again.");
    } 
    }
    return(
         <div className="login-page">
      
                <div className="login-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-header">
                            <h1 className="login-title">Login to Your Account</h1>
                        </div>
                        <div className="form-group">
                            <input type="text" 
                            placeholder="Email Address"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            className="login-input"
                            required   
                            />

                            <input type="password" 
                            placeholder="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            className="login-input"
                            required   
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" 
                            className="login-btn"
                            >Login</button>
                            <NavLink to ="/register" >
                                <button type="button" className="register-btn">Don't have a account? <span>Register</span></button>
                            </NavLink>
                        </div>
                    </form>
                    
                </div>
            </div>
    );

}
export default Login;