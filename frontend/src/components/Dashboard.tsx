import { Link } from "react-router-dom";

const Dashboard = () => {
    const user = "Dawyda"
    return ( 
        <div>
            <nav>
                <Link to="/logout">Logout</Link>
            </nav>
            <h3>You are logged in</h3>
            Hi { user }!
        </div>
     );
}
 
export default Dashboard;