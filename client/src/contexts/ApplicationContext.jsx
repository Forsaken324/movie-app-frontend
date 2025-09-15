import { createContext, useState } from "react";

export const applicationContext = createContext(null);

export const AppContextProvider = ({children}) => {
    const [showProfileScreen, setShowProfileScreen] = useState(false);
    const [user, setUser] = useState(null);

    return <applicationContext.Provider value={{ user, setUser, showProfileScreen, setShowProfileScreen}}>
        {children}
    </applicationContext.Provider>

}