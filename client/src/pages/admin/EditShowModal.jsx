import {
  Settings,
  CircleCheckBig,
  X,
  ChevronRight,
} from "lucide-react";
import useApp from "../../hooks/useApp";
import { timeFormat } from "../../lib/timeFormat";
import { useEffect, useState } from "react";
import { lookInSession } from "../../common/session";
import { checkForAuthToken } from "../../lib/authenticate";
import axios from "axios";
import toast from "react-hot-toast";
import { useRef } from "react";

const EditShowModal = ({ show }) => {
  const { setShowEditShow, setShowToEdit } = useApp();
  const handleCloseModal = () => {
    setShowEditShow(false);
    setShowToEdit(null);
  };
  const [airdate, setAirdate] = useState(null);
  const [isActive, setIsActive] = useState(show.is_active);
  const [isLoading, setIsLoading] = useState(false);
  const airdateref = useRef(null);

  checkForAuthToken();
  const token = lookInSession("quick_token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleToggleActive = () => {
    setIsLoading(true);
    if (isActive) {
      axios
        .post(
          BACKEND_URL + `/admin/show/set-inactive/${show.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsActive(false);
            return toast.success("show successfully removed from active shows", {duration: 3000});
          } else {
            return toast.error("sorry an error occured", {duration: 3000});
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
      setIsLoading(false);
    } else {
      axios
        .post(
          BACKEND_URL + `/admin/show/set-active/${show.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsActive(true);
            return toast.success("show successfully added to active shows", {duration: 3000});
          } else {
            return toast.error("sorry an error occured", {duration: 3000});
          }
        })
        .catch((error) => {
          toast.error(error.message, {duration: 3000});
        });
      setIsLoading(false);
    }
  };

  const handleAddAirDate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(!airdate)
    {
        return toast.error('You must select a date first', {duration: 3000});
    }
    const date = new Date(airdate).toISOString();
    const payload = {
        show_id: show.id,
        show_time: date
    }
    axios.post(BACKEND_URL + '/admin/show/set-time', payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if(response.status === 201)
        {
            setAirdate(null);
            airdateref.current.value = null;
            toast.success('date successfully added.', {duration: 3000});
        }
        else {
            toast.error('sorry an error occured', {duration: 3000});
        }
    })
    .catch(error => {
        toast.error(`Sorry an error occured ${error.message}`, {duration: 3000})
    })
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(airdate)
  }, [airdate]);

  return (
    <div
      className="flex flex-col items-center items-center justify-center fixed inset-0 z-400 h-full w-full"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.58)" }}
      onClick={handleCloseModal}
    >
      <div
        className="xl:h-[50%] 2xl:h-[25%] md:w-[50%] 2xl:w-[30%] bg-[#111111] rounded p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-[300px]">
            <img
              src={show.backdrop_path}
              alt={show.title}
              className="rounded-lg h-[300px] w-full md:w-[200px] object-cover object-right-bottom cursor-pointer"
            />
            <p className="font-bold text-[20px]">{show.title}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(show.release_date).getFullYear()} .{" "}
              {timeFormat(show.runtime)}
            </p>
          </div>
          <div className="w-full flex flex-col gap-5">
            <p>{show.overview}</p>
            <div className="border border-gray-400  w-full">
              <div className="flex gap-5 p-2 border-b border-gray-400">
                <p>Configurations</p>
                <Settings className="text-primary" />
              </div>
              <form className="p-2 flex gap-3 items-center" onSubmit={handleAddAirDate}>
                <div>
                  <label htmlFor="date-time">add airdate</label>
                  <br />
                  <input
                    type="datetime-local"
                    id="date-time"
                    className="bg-gray-700 p-1 rounded"
                    value={airdate}
                    onChange={(e) => setAirdate(e.target.value)}
                    ref={airdateref}
                  />
                  <br />
                </div>
                <button type="submit" className={`bg-primary p-1 rounded mt-5 ${isLoading && 'disabled cursor-not-allowed'}`}>
                  <ChevronRight />
                </button>
              </form>
              <div className="flex gap-3 p-3 items-center">
                <p>is active?</p>{" "}
                {isActive ? (
                  <button
                    className={`${
                      isLoading && "disabled cursor-not-allowed"
                    } bg-primary rounded p-1`}
                  >
                    <CircleCheckBig onClick={handleToggleActive} />
                  </button>
                ) : (
                  <button
                    className={`${
                      isLoading && "disabled cursor-not-allowed"
                    } bg-primary rounded`}
                  >
                    <X onClick={handleToggleActive} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShowModal;
