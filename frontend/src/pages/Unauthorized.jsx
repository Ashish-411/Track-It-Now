import { NavLink } from "react-router-dom";
function Unauthorized(){
    return(
        <div>
            <h1>401 Unauthorized!</h1>
            <h3>You are unauthorized to access this page..</h3>
            <NavLink to = "/">
                <button>Go Back to Home</button>
            </NavLink>
        </div>
    );
}
export default Unauthorized;