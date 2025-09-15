import { timeFormat } from "../lib/timeFormat";
import { Dot } from "lucide-react";
import axios from "axios";
import { lookInSession } from "../common/session";
import toast from "react-hot-toast";
import { useState } from "react";

const BookedCard = ({booking}) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const date = new Date(booking.show.show_date_time);
    const [isLoading, setIsLoading] = useState(false);
    const time = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/lagos',
        hour12: true
    });
    const totalTickets = booking.booked_seats.length;

    const makeBookingPayment = async () => {

        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

        const token = lookInSession('quick_token');
        if (!token)
        {
            scrollTo(0, 0);
            document.body.style.overflow = "hidden";
            setShowAuthScreen(true);
            return toast.error("Sorry, you need to be logged in first");
        }
        setIsLoading(true);
        toast.loading('Initiating payment, buckle up')
        await axios.post(BACKEND_URL + `/shows/show/make-payment/${booking.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status == 200)
            {
                window.location.href = response.data
            }
        })
        .catch(error => {
            toast.error(error.message);
            setIsLoading(false);
        })
        
    }

    const handlePrintTicket = () => {

    }

    return (
        <div className="bg-primary/10 border border-primary/30 flex flex-col md:flex-row md:items-center md:justify-between w-auto sm:w-[823px] my-6 px-2 py-3 mr-4 rounded-xl">
            <div className="flex gap-4">
                <img className="w-40 md:max-w-45 h-[50%] aspect-video sm:h-auto object-cover object-bottom rounded" src={booking.show.movie.backdrop_path}  alt={booking.show.movie.title} />
                <div className="flex flex-col justify-around">
                    <div>
                        <p className="text-white font-bold text-[17px]">{booking.show.movie.title}</p>
                        <p className="text-sm text-gray-400">{timeFormat(booking.show.movie.runtime)}</p>
                    </div>
                    <span className="flex text-gray-400 text-sm items-center">{date.toDateString()} <Dot /> {time}</span>
                </div>
            </div>
            <div className="flex flex-col h-full justify-evenly">
                <div className="flex gap-3 items-center pt-2">
                    <p className="font-bold text-[25px]">{currency} {booking.amount}</p>
                    {!booking.is_paid && <button className={` ${isLoading ? 'disabled cursor-not-allowed bg-gray-300' : 'bg-primary hover:bg-primary-dull'} duration-300 transition px-4 py-1.5 mt-2 mb-3 text-sm rounded-lg font-medium cursor-pointer`} onClick={makeBookingPayment}>Pay Now</button>}
                    {booking.is_paid && <button className={` ${isLoading ? 'disabled cursor-not-allowed bg-gray-300' : 'bg-[#111111] hover:bg-black'} duration-300 transition px-4 py-1.5 mt-2 mb-3 text-sm rounded-lg font-medium cursor-pointer`} onClick={handlePrintTicket}>Print ticket</button>}
                </div>
                <div className="text-sm text-gray-400">
                    <p>Total TIckets: <span className="text-white font-bold">{totalTickets}</span></p>
                    <p>Seat Number: <span className="text-white font-bold">{`${booking.booked_seats.join(', ')}`}</span></p>
                </div>
            </div>
        </div>
    )
}

export default BookedCard;