import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context)
    {
        throw new Error('authContext must be used with an auth context provider');
    }
    return context;
}