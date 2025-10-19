import { lookInSession } from "../common/session"
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export const checkForAuthToken = () => {
    const {setShowAuthScreen} = useAuth();
    const token = lookInSession('quick_token');
    if (!token)
    {
        scrollTo(0,0);
        document.body.style.overflow = 'hidden';
        setShowAuthScreen(true);
        return toast.error('Sorry, you need to be logged in first.');
    }
}
