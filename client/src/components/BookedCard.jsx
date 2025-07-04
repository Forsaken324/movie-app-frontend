import { timeFormat } from "../lib/timeFormat";
import { Dot } from "lucide-react";


const BookedCard = ({booking}) => {
    const date = new Date(booking.show.showDateTime);
    const time = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/lagos',
        hour12: true
    })
    const totalTickets = booking.bookedSeats.length;
    return (
        <div className="bg-primary/10 border border-primary/30 flex items-center justify-between h-[155px] sm:w-[823px]  my-6 px-2 rounded-xl">
            <div className="flex gap-4">
                <img className="w-[203px] h-[135px] rounded-lg" src={booking.show.movie.backdrop_path}  alt={booking.show.movie.title} />
                <div className="flex flex-col justify-around">
                    <div>
                        <p className="text-white font-bold text-[17px]">{booking.show.movie.title}</p>
                        <p className="text-sm text-gray-400">{timeFormat(booking.show.movie.runtime)}</p>
                    </div>
                    <span className="flex text-gray-400 text-sm items-center">{date.toDateString()} <Dot /> {time}</span>
                </div>
            </div>
            <div className="flex flex-col h-full justify-evenly">
                <p className="font-bold text-[25px]">{import.meta.env.VITE_CURRENCY} {booking.amount}</p>
                <div className="text-sm text-gray-400">
                    <p>Total TIckets: <span className="text-white font-bold">{totalTickets}</span></p>
                    <p>Seat Number: <span className="text-white font-bold">{`${booking.bookedSeats.join(', ')}`}</span></p>
                </div>
            </div>
        </div>
    )
}

export default BookedCard;