import { useUserContext } from "../context/UserContext";
import Navbar from "./Navbar";

const Dashboard = () => {
    const { user } = useUserContext();

    if(!user){
        return null;
    }

    return ( 
        <div>
            <Navbar />
            <h3>You are logged in</h3>
            Hi { user.username }!
        </div>
     );
}
 
export default Dashboard;