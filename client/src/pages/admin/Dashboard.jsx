import { useEffect, useState } from "react";
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UsersIcon } from "lucide-react";
import LoadingAnimation from "../../components/animations/LoadingAnimation";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import DashboardCard from "../../components/admin/DashboardCard";
import AdminMovieCard from "./AdminMovieCard";
import axios from "axios";
import { lookInSession } from "../../common/session";
import { Navigate } from "react-router-dom";
import toast from 'react-hot-toast'
import useApp from "../../hooks/useApp";
import EditShowModal from "./EditShowModal";

const DashBoard = () => {
    const currency = import.meta.env.VITE_CURRENCY;

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    })

    const {showEditShow, showToEdit} = useApp();

    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        { title: 'Total Bookings', value: dashboardData.totalBookings || '0', icon: ChartLineIcon },
        { title: 'Total Revenue', value: `${currency} ${dashboardData.totalRevenue || 0}`, icon: CircleDollarSignIcon },
        { title: 'Active Shows', value: dashboardData.activeShows ? dashboardData.activeShows.length : '0', icon: PlayCircleIcon },
        { title: 'Total Users', value: dashboardData.totalUser || '0', icon: UsersIcon },
    ]

    const fetchDashboardData = () => {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const token = lookInSession('quick_token');
        if(!token)
        {
            scrollTo(0, 0);
            document.body.style.overflow = "hidden";
            setShowAuthScreen(true);
            return toast.error("Sorry, you need to be logged in first");
        }
        axios.get(BACKEND_URL + '/admin/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                // console.log(response.data);
                setDashboardData({
                    totalBookings: response.data.total_bookings ?? 0,
                    totalRevenue: response.data.total_revenue ?? 0,
                    activeShows: response.data.active_shows ?? [],
                    totalUser: response.data.total_user ?? 0
                });
                
                setLoading(false);
                
            }
            
            else {
                toast.error('Sorry an error occured');
            }
            
        })
        .catch(error => {
            if(error.response?.status === 403 || error.response?.status === 401)
            {
                return <Navigate to={'/unauthorized'} />
            } else {
                toast.error('Sorry an error occured');
            }

        });
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        console.log(dashboardData);
        console.log('here');
    }, [dashboardData]);

    return !loading ? (
        <div>
            <BlurCircle className="top-0 right-0 md:left-90" />
            <Title title={'Admin Dashboard'} />
            <div className="mt-10 flex flex-col items-center md:flex-row gap-2">
                {
                    dashboardCards.map((card, index) => (
                        <DashboardCard key={index} card={card} />
                    ))
                }
            </div>
            <h2 className="text-xl font-medium mt-20 mb-10">Active Movies</h2>
            <div className="flex flex-wrap gap-5 justify-center items-center md:items-start md:justify-start">
                {
                    dashboardData.activeShows.length > 0 ? dashboardData.activeShows.map((show, index) => (
                        <AdminMovieCard key={index} show={show} />
                    )) : ''
                }
            </div>
            <BlurCircle className="bottom-0 left-0 md:left-50" />
            <BlurCircle className="bottom-0 right-0" />
            {showEditShow && <EditShowModal show={showToEdit} />}
        </div>
    ) : (
        <div className='flex items-center justify-center'><LoadingAnimation /></div>
    )
}

export default DashBoard;