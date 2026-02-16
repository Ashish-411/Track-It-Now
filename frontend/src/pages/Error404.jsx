import { NavLink } from "react-router-dom";
function Error404(){
    return(
        <>
        <h1>ERROR 404!</h1>
        <p>There is no page with such URL!!</p>
        <NavLink to ="/">
            <button>Go Back TO Home</button>
        </NavLink>

        </>
    );

}
export default Error404;