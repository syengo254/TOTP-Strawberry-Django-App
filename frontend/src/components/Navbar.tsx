import { Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav style={{ display: 'flex', columnGap: "1rem"}}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/logout">Logout</Link>
        </nav>
     );
}
 
export default Navbar;