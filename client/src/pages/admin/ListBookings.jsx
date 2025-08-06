import { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import LoadingAnimation from "../../components/animations/LoadingAnimation";
import { dashedDate } from "../../lib/dashedDate";
import isoTimeFormat from "../../lib/isoTimeFormat";
import BlurCircle from "../../components/BlurCircle";

const ListBookings = () => {
    const [booking, setBooking] = useState(null);

    const getBooking = async () => {
        setBooking(dummyBookingData);
    }

    const currency = import.meta.env.VITE_CURRENCY;

    useEffect(() => {
        getBooking();
    }, []);

    return (
        <div>
            <BlurCircle className={'md:left-100'} />
            <h1 className="text-[22px]">List <span className="text-primary underline">Bookings</span></h1>
            {booking ? (
                <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="mt-10 min-w-[823px] h-[197px] border border-separate border-spacing-0 rounded-md border-primary/50 ">
                            <thead>
                                <tr className="bg-primary/30 h-[70px] rounded-tl">
                                    <th className="pl-5 w-[250px] text-start">User Name</th>
                                    <th className="w-[250px] text-start">Movie Name</th>
                                    <th className="w-[250px] text-start">Show Time</th>
                                    <th className="w-[150px] text-start">Seats</th>
                                    <th className="w-[150px] text-start">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {booking.map((booking, index) => (
                                    <tr key={index} className="bg-primary/10">
                                        <td className="pl-5 h-[60px] text-gray-300 border border-x-0 border-primary/40">{booking.user.name}</td>
                                        <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40" >{booking.show.movie.title}</td>
                                        <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">{dashedDate(booking.show.showDateTime)} {isoTimeFormat(booking.show.showDateTime)}</td>
                                        <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">{booking.bookedSeats.join(', ').trim(",")}</td>
                                        <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">{currency}{booking.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            ) : <LoadingAnimation />}
        </div>
    )
}


export default ListBookings;