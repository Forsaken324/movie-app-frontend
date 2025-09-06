import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import LoadingAnimation from "../components/animations/LoadingAnimation";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import { ArrowRight, ClockIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { lookInSession } from "../common/session";
import { useAuth } from "../hooks/useAuth";

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();
  const { setShowAuthScreen } = useAuth();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getShow = async () => {
    const show = await axios
      .get(BACKEND_URL + `/shows/${id}`)
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        } else {
          return toast.error("An error occured, try again later");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const showAiringDates = await axios
      .get(BACKEND_URL + `/shows/${id}/time`)
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        } else {
          return toast.error("An error occured, try again later");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    if (show) {
      setShow({ movie: show, dateTime: showAiringDates });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select 5 seats");
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const renderSeats = (row, count = 9) => {
    return (
      <div key={row} className="flex gap-2 mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            return (
              <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${
                  selectedSeats.includes(seatId) && "bg-primary text-white"
                }`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const proceedToCheckout = async () => {
    if (!selectedTime || selectedSeats.length == 0) {
      return toast.error("Select a time and seat first before booking");
    }

    const token = lookInSession("quick_token");
    if (!token) {
      setShowAuthScreen(true);
      scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      return toast.error("You need to be logged in first");
    }
    // const isoFormatTime = new Date(selectedTime).
    const payload = {
      show_time: selectedTime.time,
      booked_seats: selectedSeats,
    };

    await axios
      .post(BACKEND_URL + `/shows/book-show/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          toast.success(
            "The show has been booked successfully, check bookings and make payment"
          );
          navigate("/my-bookings");
        }
        if (response.status == 422) {
          return toast("sorry an error occured");
        }
      })
      .catch((error) => {
        if (error.status == 403) {
          scrollTo(0, 0);
          document.body.style.overflow = "hidden";
          toast.error("Sorry an error occurred, you need to sign in again");
          setShowAuthScreen(true);
          return;
        }
        if (error.status == 400)
        {
          return toast.error('You cannot book for a date in the past');
        }
        console.error("Error: ", error);
      });
  };

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available Timings */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div>
          {show.dateTime[date].map((item, index) => (
            <div
              key={item.time}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition  ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              }`}
              onClick={() => setSelectedTime(item)}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Seats Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle className={"top-[-100px] left-[-100px]"} />
        <BlurCircle className={"bottom-0 right-0"} />
        <h1 className="text-2xl font-semibild mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen image" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6g ghcdcxqDTFWYTYTRD mb-5">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, id) => (
              <div key={id}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>
        <button
          onClick={proceedToCheckout}
          className="flex justify-between bg-primary hover:bg-primary-dull duration-300 m-15 h-[44px] w-[230px] rounded-full items-center justify-center"
        >
          Proceed to checkout <ArrowRight strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center mt-50">
      <LoadingAnimation />
    </div>
  );
};

export default SeatLayout;
