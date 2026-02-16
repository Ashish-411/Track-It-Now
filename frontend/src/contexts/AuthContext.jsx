import { useState , useEffect, createContext, useContext} from "react";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants";
import api from "../api";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

//creating context Auth context
 const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({children}){
    const [token,setToken] = useState(null);
    const [isAuthenticated,setIsAuthenticated] = useState(null);
    const [role,setRole] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    //getting token from local storage
    useEffect(()=>{
        const access = localStorage.getItem(ACCESS_TOKEN);

        if(!access){
            setIsAuthenticated(false);
            return;
        }
       checkAuth(access);
    },[]);
    //expiry check

    const checkAuth = async(accessToken) =>{
        try{
            const decode = jwtDecode(accessToken);
            const now = Date.now()/1000;

            if(decode.exp < now){
                await refreshAccessToken();
            }else{
                console.log("token still valid");
                setToken(accessToken);
                setIsAuthenticated(true);
                setRole(decode.role);
                await fetchProfile();
            }
        }catch(err){
            console.log(err);
            logout();
        }
    }
    //login
    const login = async({access_token})=>{
        const decoded = jwtDecode(access_token);
        localStorage.setItem(ACCESS_TOKEN,access_token);
        setToken(access_token);
        setIsAuthenticated(true);
        setRole(decoded.role);
        await fetchProfile();
    }
    //fetch profile
    const fetchProfile = async() => {
        try{
            const res = await api.get("api/auth/profile");
            console.log("Profile info",res.data);
            setUser(res?.data);
        }catch(err){
            console.error("failed to fetch profile", err);
            logout();
        }
    }
    //logout
    const logout = async() =>{
        try{
            await api.get("/api/auth/logout");
        }catch(err){
            console.error("Backend logout failed", err);
        }finally{
                localStorage.removeItem(ACCESS_TOKEN);
                setToken(null);
                setIsAuthenticated(null);
                setRole(null);
                //setId(null);
                navigate("/login");
        }
    }
    //refresh token logic
    const refreshAccessToken = async () =>{
        try{
            const res = await api.get("/api/auth/refresh",{withCredentials:true});
            const newAccessToken = res.data.access_token;
            localStorage.setItem(ACCESS_TOKEN,newAccessToken);
            const decoded = jwtDecode(newAccessToken);
            setToken(newAccessToken);
            setIsAuthenticated(true);
            setRole(decoded.role);
           // setId(decoded.id);
            await fetchProfile();
            return newAccessToken;
        }catch(err){
            console.log(err.response?.data || err.message);
            logout();
            return null;
        }
    }
    const value = {
        token,
        isAuthenticated,
        role,
        user,
        login,
        logout,
        refreshAccessToken,
    };
    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    );
}