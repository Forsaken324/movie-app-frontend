import { useContext } from "react"
import { applicationContext } from "../contexts/ApplicationContext"

const useApp = () => {
    const context = useContext(applicationContext);
    if (!context)
    {
        throw new Error('Application context must be used within a valid provider');
    }
    return context;
}

export default useApp;