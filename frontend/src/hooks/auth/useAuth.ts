import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const CHECK_AUTH = gql`
query {
    isUserLoggedin{
      user{
        id
        username
        twoFaEnabled
      }
      loggedIn
    }
  }
`

export default function useAuth(setUser: any){
    const { data } = useQuery(CHECK_AUTH);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if(data && data.isUserLoggedin){
            console.log(data)
            const {user, loggedIn} = data.isUserLoggedin;
            if(loggedIn){
                setUser(user);
            }
            setAuthenticated(loggedIn);
        }
    }, [data]);

    return {authenticated, setAuthenticated};
}