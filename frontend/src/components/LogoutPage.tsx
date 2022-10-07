import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const LOGOUT_USER = gql`
mutation {
    userLogout {
      message
    }
  }
`

const LogoutPage = () => {
    const {setUser} = useUserContext();
    const [logoutMutation, {loading}] = useMutation(LOGOUT_USER);

    useEffect(() => {
        logoutMutation()
        .then(_ => {
            setUser(null);
        })
        .catch( e => console.log(e))
    }, []);

    return ( 
        <div>
            {loading ? "Logging you out...Please wait." : "You have been logged out successfully." }
            <p>
                <Link to="/">Login</Link>
            </p>
        </div>
     );
}
 
export default LogoutPage;