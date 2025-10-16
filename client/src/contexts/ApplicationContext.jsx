import { createContext, useState } from "react";

export const applicationContext = createContext(null);

export const AppContextProvider = ({children}) => {
    const [showProfileScreen, setShowProfileScreen] = useState(false);
    const [user, setUser] = useState(null);
    const [showEditShow, setShowEditShow] = useState(false);
    const [showToEdit, setShowToEdit] = useState(null);

    return <applicationContext.Provider value={{ user, setUser, showProfileScreen, setShowProfileScreen, showEditShow, setShowEditShow, showToEdit, setShowToEdit}}>
        {children}
    </applicationContext.Provider>

}