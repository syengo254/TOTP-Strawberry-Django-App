import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import useAuth from "../hooks/auth/useAuth";

const Dashboard = () => {
    const {authenticated, user} = useUserContext();
    const navigate = useNavigate()

    useEffect(() => {
        if(!authenticated){
            navigate('/')
        }
    }, []);

    if(!user){
        return null;
    }

    return ( 
        <div>
            <nav>
                <Link to="/logout">Logout</Link>
            </nav>
            <h3>You are logged in</h3>
            Hi { user.username }!
        </div>
     );
}
 
export default Dashboard;