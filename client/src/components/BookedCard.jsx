import { timeFormat } from "../lib/timeFormat";
import { Dot } from "lucide-react";


const BookedCard = ({booking}) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const date = new Date(booking.show.show_date_time);
    const time = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/lagos',
        hour12: true
    });
    const totalTickets = booking.booked_seats.length;
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
                    {!booking.is_paid && <button className="bg-primary hover:bg-primary-dull duration-300 transition px-4 py-1.5 mt-2 mb-3 text-sm rounded-lg font-medium cursor-pointer">Pay Now</button>}
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