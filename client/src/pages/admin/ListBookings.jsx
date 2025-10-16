import { useEffect, useState } from "react";
import LoadingAnimation from "../../components/animations/LoadingAnimation";
import { dashedDate } from "../../lib/dashedDate";
import isoTimeFormat from "../../lib/isoTimeFormat";
import BlurCircle from "../../components/BlurCircle";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { lookInSession } from "../../common/session";

const ListBookings = () => {
  const [booking, setBooking] = useState(null);
  const { setShowAuthScreen } = useAuth();

  const getBooking = async () => {
    const token = lookInSession("quick_token");
    if (!token) {
      scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      setShowAuthScreen(true);
      return toast.error("Sorry, you need to be logged in first");
    }
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    axios
      .get(BACKEND_URL + "/admin/list-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setBooking(response.data);
          return;
        } else {
          toast.error("sorry an error occured");
        }
      })
      .catch((error) => {
        const message = error.response.data;
        toast.error(`sorry an error occured ${message}`);
      });
  };

  const currency = import.meta.env.VITE_CURRENCY;

  useEffect(() => {
    getBooking();
  }, []);

  return (
    <div>
      <BlurCircle className={"md:left-100"} />
      <h1 className="text-[22px]">
        List <span className="text-primary underline">Bookings</span>
      </h1>
      {booking ? (
        <div className="overflow-x-auto">
          <table className="mt-10 min-w-[978px] table-auto border border-separate border-spacing-0 rounded-md border-primary/50">
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
                  <td className="pl-5 h-[60px] text-gray-300 border border-x-0 border-primary/40">
                    {booking.user.name}
                  </td>
                  <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">
                    {booking.show.show.title}
                  </td>
                  <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">
                    {dashedDate(booking.show.show_date_time)}{" "}
                    {isoTimeFormat(booking.show.show_date_time)}
                  </td>
                  <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">
                    {booking.booked_seats.join(", ").trim(",")}
                  </td>
                  <td className="h-[60px] text-gray-300 border border-x-0 border-primary/40">
                    {currency}
                    {booking.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </div>
  );
};

export default ListBookings;
