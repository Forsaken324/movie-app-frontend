import BlurCircle from "../../components/BlurCircle";
import { dummyListShowsData } from "../../assets/assets";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../components/animations/LoadingAnimation";
import isoTimeFormat from "../../lib/isoTimeFormat";
import { dashedDate } from "../../lib/dashedDate";
import { lookInSession } from "../../common/session";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import axios from "axios";

const ListShows = () => {
    const [shows, setShows] = useState(null);
    const {setShowAuthScreen} = useAuth();

    const getShows = async () => {
        const token = lookInSession('quick_token');
        if(!token)
        {
            scrollTo(0, 0);
            document.body.style.overflow = "hidden";
            setShowAuthScreen(true);
            return toast.error("Sorry, you need to be logged in first");
        }
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        axios.get(BACKEND_URL + '/admin/list-shows', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if(response.status === 200)
            {
                setShows(response.data);
                return;
            }
            else{
                toast.error('sorry an error occured');
            }
        })
        .catch(error => {
            const message = error.response.data;
            toast.error(`sorry an error occured ${message}`);
        })
    };
    const currency = import.meta.env.VITE_CURRENCY;
    // const dataXTime = (datetimeString) => {
    //     const date = new Date(datetimeString);
    //     return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`
    // }
    useEffect(() => {
        getShows();
    }, [])
    return (
        <div>
            <BlurCircle className={'md:left-100'} />
            <h1 className="text-[22px]">List <span className="text-primary underline">Shows</span></h1>
            {shows ? (
                <table className="mt-10 w-[723px] h-[197px] border border-separate border-spacing-0 rounded-md border-primary/50 ">
                    <thead>
                        <tr className="bg-primary/30 h-[70px] rounded-tl">
                            <th className="pl-5 w-[250px] text-start">Movie Name</th>
                            <th className="w-[250px] text-start">Show Time</th>
                            <th className="w-[250px] text-start">Total Booking</th>
                            <th className="w-[150px] text-start">Earning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shows.map((show, index) => (
                            <tr key={index} className="bg-primary/10">
                                <td className="pl-5 h-[60px] border border-x-0 border-primary/40">{show.show_title}</td>
                                <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40" >{dashedDate(show.show_time.show_time)} {isoTimeFormat(show.show_time.show_time)}</td>
                                <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">{show.total_bookings}</td>
                                <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">{currency}{show.earnings}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <LoadingAnimation />
            )}
        </div>
    )
}

export default ListShows;