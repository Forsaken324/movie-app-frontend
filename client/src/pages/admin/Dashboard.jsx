import { useEffect, useState } from "react";
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UsersIcon } from "lucide-react";
import { dummyDashboardData } from "../../assets/assets";
import LoadingAnimation from "../../components/animations/LoadingAnimation";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";

const DashBoard = () => {
    const currency = import.meta.env.VITE_CURRENCY;

    const [ dashboardDate, setDashboardData ] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    })

    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        {title: 'Total Bookings', value: dashboardDate.totalBookings || '0', icon: ChartLineIcon},
        {title: 'Total Revenue', value: dashboardDate.totalRevenue || '0', icon: CircleDollarSignIcon},
        {title: 'Active Shows', value: dashboardDate.activeShows || '0', icon: PlayCircleIcon},
        {title: 'Total Users', value: dashboardDate.totalUser || '0', icon: UsersIcon},

    ]

    const fetchDashboardData = async () => {
        setDashboardData(dummyDashboardData);
        setLoading(false);
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return !loading ? (
        <div>
            <BlurCircle className="top-0 left-90" />
            <Title title={'Admin Dashboard'} />
        </div>
    ) : (
        <div className='flex items-center justify-center'><LoadingAnimation /></div>
    )
} 

export default DashBoard;