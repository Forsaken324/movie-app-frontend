import { createContext, useEffect, useState } from "react";
import { lookInSession } from "../common/session";

export const authContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [showAuthScreen, setShowAuthScreen] = useState(false);
    const token = lookInSession('quick_token');
    const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);
    const [authenticatedUsername, setAuthenticatedUsername] = useState('');

    return <authContext.Provider value={{showAuthScreen, setShowAuthScreen, isLoggedIn, setIsLoggedIn, authenticatedUsername, setAuthenticatedUsername}}>
        {children}
    </authContext.Provider>

}