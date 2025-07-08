import { useEffect, useState } from "react";
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UsersIcon } from "lucide-react";
import { dummyDashboardData } from "../../assets/assets";
import LoadingAnimation from "../../components/animations/LoadingAnimation";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import DashboardCard from "../../components/admin/DashboardCard";
import AdminMovieCard from "./AdminMovieCard";

const DashBoard = () => {
    const currency = import.meta.env.VITE_CURRENCY;

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    })

    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        { title: 'Total Bookings', value: dashboardData.totalBookings || '0', icon: ChartLineIcon },
        { title: 'Total Revenue', value: currency + dashboardData.totalRevenue || '0', icon: CircleDollarSignIcon },
        { title: 'Active Shows', value: dashboardData.activeShows.length || '0', icon: PlayCircleIcon },
        { title: 'Total Users', value: dashboardData.totalUser || '0', icon: UsersIcon },
    ]

    const fetchDashboardData = async () => {
        setDashboardData(dummyDashboardData);
        setLoading(false);
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return !loading ? (
        <div className="">
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
                    dashboardData.activeShows.map((show, index) => (
                        <AdminMovieCard key={index} show={show} />
                    ))
                }
            </div>
            <BlurCircle className="bottom-0 left-0 md:left-50" />
            <BlurCircle className="bottom-0 right-0" />
        </div>
    ) : (
        <div className='flex items-center justify-center'><LoadingAnimation /></div>
    )
}

export default DashBoard;