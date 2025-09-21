import axios from "axios"
import { assets } from "../assets/assets";
import { useState } from "react";
import { EyeOff, Eye, ChevronRight, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {toast} from 'react-hot-toast'
import { storeInSession } from "../common/session";

const LoginXSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { setShowAuthScreen, setAuthenticatedUsername, setIsLoggedIn } = useAuth();

    const [loginMode, setLoginMode] = useState(true)
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const cancelAuthScreen = () => {
        document.body.style.overflow = 'scroll';
        setShowAuthScreen(false)
    }

    const loginUser = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        await axios.post(VITE_BACKEND_URL + '/auth/login/access-token', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if(response.status == 200)
            {
                storeInSession(response.data.access_token, 'quick_token');
                const token = response.data.access_token;
                axios.post(VITE_BACKEND_URL + '/auth/login/test-token', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if(response.status == 200)
                    {
                        setAuthenticatedUsername(response.data.username);
                    }else {
                        setAuthenticatedUsername(formData.email);
                    }
                })
                .catch(error => {
                    console.log('Error: ', error);
                });
                
                setIsLoggedIn(true);
                setIsLoading(false);
                cancelAuthScreen();
                toast.success('Login successful');
                window.location.reload()
                return


            }else if (response.status == 404){
                return toast.error("Invalid login credentials")
            }
        })
        .catch(error => {
            console.log('Error: ', error)
            setIsLoading(false);
            return
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (loginMode)
        {
            loginUser(email, password);
            return
        }
        console.log('here');
        const signUpPayload = {
            'firstname': firstname,
            'lastname': lastname,
            'username': username,
            'email': email,
            'image_path': null,
            'password': password
        }

        await axios.post(VITE_BACKEND_URL + '/auth/sign-up', signUpPayload)
        .then(response => {
            if(response.status == 201)
            {
                toast.success('Sign-up successful, logging you in');
                loginUser(signUpPayload.email, signUpPayload.password);
                setIsLoading(false);
                return
            } else if (response.status == 400)
            {
                setIsLoading(false);
                return toast.error('The credentials you provided already exists, proceed to login or edit credentials')
                
            }
        })
        .catch(error => {
            if(error.status == 400)
            {
                setIsLoading(false);
                toast.error('The credentials you provided already exists, proceed to login or edit credentials')
                return;
            }
            console.log('Error: ', error);
        })
    }


    return (
    <div className="flex flex-col items-center fixed inset-0 z-300 items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} onClick={cancelAuthScreen}>
        <div className="flex flex-col items-center justify-center bg-white text-black mt-20 py-5 px-10 rounded rounded-lg" onClick={(e) => e.stopPropagation()}>
            <button className="ml-[90%]" onClick={cancelAuthScreen}><X /></button>
            <h2>Sign in to <span className="font-bold">Quickshow</span></h2>
            <p>Welcome back! Please sign in to continue</p>
            <button className="flex items-center justify-center gap-2 mt-4 w-full text-gray-400 border border-gray-400 rounded rounded-lg py-1" onClick={() => window.alert('Trust me, this feature is on its way')}>
                <img src={assets.googleSvg} alt="google-logo" />
                <p className="text-gray-500 text-sm">Continue with Google</p>
            </button>
            <div className="flex items-center w-full gap-2 mt-4">
                <div className="h-[1px] bg-gray-400 w-[80%]"></div>
                <p>or</p>
                <div className="h-[1px] bg-gray-400 w-[80%]"></div>
            </div>
            <div className="w-full pb-3 mt-4">
                <form onSubmit={handleSubmit}>
                    {
                        !loginMode  ? (
                            <>
                                <label htmlFor="firstname">Firstname</label><br />
                                <input type="text" id="firstname" value={firstname} className="mb-3 border border-gray-400 rounded p-1 outline-yellow-300" onChange={(e) => setFirstname(e.target.value)} placeholder="Enter your firstname" required/><br/>
                                <label htmlFor="lastname">Lastname</label><br />
                                <input type="text" id="lastname" value={lastname} className="mb-3 border border-gray-400 rounded p-1 outline-yellow-300" onChange={(e) => setLastname(e.target.value)} placeholder="Enter your lastname" required/><br/>
                                <label htmlFor="username">Username</label><br />
                                <input type="text" id="username" value={username} className="mb-3 border border-gray-400 rounded p-1 outline-yellow-300" onChange={(e) => setUsername(e.target.value)} placeholder="Enter your desired username" required/><br/>
                            </>
                        ) : ''
                    }
                    <label htmlFor="email-address">Email address</label><br />
                    <input type="email" id="email-address" value={email} className="mb-3 border border-gray-400 rounded p-1 outline-yellow-300" onChange={(e) => setEmail(e.target.value)} placeholder={`Enter email ${loginMode ? 'or username' : ''}`} required/><br/>
                    <label htmlFor="password">Password</label><br />
                    <div className="flex items-center gap-3">
                        <input type={showPassword ? 'text' : 'password'} id="password" className="border border-gray-400 outline-yellow-300 rounded p-1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
                        {!showPassword ? <EyeOff onClick={() => setShowPassword(true)} height={20} /> : <Eye onClick={() => setShowPassword(false)} height={20} />}
                    </div><br />
                    <button type="submit" className={`flex items-center justify-center text-white rounded rounded-lg w-full py-2 ${isLoading ? 'disabled bg-gray-400 cursor-not-allowed' : 'bg-gray-950 cursor-pointer'}`}>Continue <ChevronRight /></button>
                </form>
            </div>
            <div className="text-gray-400 w-full"></div>
            <p className="text-gray-400 text-sm">{loginMode ? 'Don\'t have an account?' : 'Already have an account?'} <span className="text-gray-500 text-[15px] cursor-pointer hover:underline" onClick={(e) => setLoginMode(!loginMode)}>{loginMode  ? 'Sign up' : 'Sign in'}</span></p>
            <div className="text-gray-400 w-full"></div>
        </div>
    </div>
    )
}

export default LoginXSignup;