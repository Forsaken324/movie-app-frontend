import axios from "axios"
import { assets } from "../assets/assets";
import { useState } from "react";
import { EyeOff, Eye, ChevronRight, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const LoginXSignup = (mode) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { setShowAuthScreen } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const cancelAuthScreen = () => {
        document.body.style.overflow = 'scroll';
        setShowAuthScreen(false)
    }

    return (
    <div className="flex flex-col items-center absolute z-300 items-center h-full w-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} onClick={cancelAuthScreen}>
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
                    <label htmlFor="email-address">Email address</label><br />
                    <input type="email" id="email-address" value={email} className="mb-3 border border-gray-400 rounded p-1 outline-yellow-300" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email or username" required/><br/>
                    <label htmlFor="password">Password</label><br />
                    <div className="flex items-center gap-3">
                        <input type={showPassword ? 'text' : 'password'} id="password" className="border border-gray-400 outline-yellow-300 rounded p-1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
                        {!showPassword ? <EyeOff onClick={() => setShowPassword(true)} height={20} /> : <Eye onClick={() => setShowPassword(false)} height={20} />}
                    </div><br />
                    <button className="flex items-center justify-center text-white bg-gray-950 rounded rounded-lg w-full py-2">Continue <ChevronRight /></button>
                </form>
            </div>
            <div className="text-gray-400 w-full"></div>
            <p className="text-gray-400 text-sm">Don't have an account? <span className="text-gray-500 text-[15px] hover:text-underline">Sign up</span></p>
            <div className="text-gray-400 w-full"></div>
        </div>
    </div>
    )
}

export default LoginXSignup;