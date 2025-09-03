import { createContext, useState } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [showAuthScreen, setShowAuthScreen] = useState(false);

    return <authContext.Provider value={{showAuthScreen, setShowAuthScreen}}>
        {children}
    </authContext.Provider>

}