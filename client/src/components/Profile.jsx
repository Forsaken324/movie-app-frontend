import { useEffect, useState } from "react";
import axios from "axios";
import { lookInSession } from "../common/session";
import toast from "react-hot-toast";
import useApp from "../hooks/useApp";

const Profile = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const { user, setUser, showProfileScreen, setShowProfileScreen } = useApp();
    
    const getUser = async () => {
        const token = lookInSession('quick_token');
        axios.post(BACKEND_URL + '/auth/login/test-token', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.error('An error occured', error);
        })
    }



    useEffect(() => {
        getUser();
    }, []);

    return user && <div className={`h-[50px] w-[50px] ${showProfileScreen ? 'hidden' : ''} rounded-full overflow-hidden`} onClick={() => setShowProfileScreen(true)} >
        <img src={user.image_path} alt="profile photo" className="h-full w-full object-cover" />
    </div>
}

export default Profile;