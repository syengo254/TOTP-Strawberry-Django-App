import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useAuth from "../hooks/auth/useAuth";

const UserContext = createContext<any>(null);

export function UserContextProvider({children}: {children: ReactNode }){
    const [user, setUser] = useState();
    const {authenticated, setAuthenticated} = useAuth(setUser);

    const contextValue = {
        authenticated, user, setUser
    }
    useEffect(() => {
        setAuthenticated(user ? true : false);
    }, [user])
    
    return (
        <UserContext.Provider value={contextValue}>
        {children}
        </UserContext.Provider>
    );
};

export function useUserContext(){
    return useContext(UserContext);
}