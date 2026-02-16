import UserHome from "../components/UserHome";
import AgentHome from "../components/AgentHome";
import { useAuth } from "../contexts/AuthContext";
function Home(){
    const {role} = useAuth();
    if (role === 'customer'){
        return <UserHome/>
    }

    return <AgentHome/>
}
export default Home;