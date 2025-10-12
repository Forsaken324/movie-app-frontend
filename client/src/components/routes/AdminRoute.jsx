import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useApp from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { lookInSession } from "../../common/session";
import axios from "axios";

export const AdminRoute = ({ children }) => {
  const { user, setUser} = useApp();
  const token = lookInSession('quick_token');
  const { setShowAuthScreen } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!token) {
      toast.error("Sorry, you need to be logged in first");
      document.body.style.overflow = "hidden";
      setShowAuthScreen(true);
      scrollTo(0, 0);
      navigate("/");
    }
    if (!user)
    {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        axios.post(BACKEND_URL + '/auth/login/test-token', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUser(response.data);
            console.log(user)
        })
        .catch(error => {
            toast.error('Sorry an error occured, try again later');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        })
    }
  }, [user, navigate, setShowAuthScreen]);
  if (!user) return null;
  if (!user.is_admin) return <Navigate to="/unauthorized" replace />;
  return children;
};
