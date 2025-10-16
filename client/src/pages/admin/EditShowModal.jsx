import { SettingsIcon, Trash2Icon, TrashIcon } from "lucide-react";
import useApp from "../../hooks/useApp";
import { timeFormat } from "../../lib/timeFormat";
import { useState } from "react";

const EditShowModal = ({ show }) => {
    const {setShowEditShow, setShowToEdit} = useApp();
    const handleCloseModal = () => {
        setShowEditShow(false);
        setShowToEdit(null);
    }
    const [airdate, setAirdate] = useState(null);
    const [isActive, setIsActive] = useState(show.is_active)
  return (
    <div className="flex flex-col items-center items-center justify-center fixed inset-0 z-400 h-full w-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.58)' }} onClick={handleCloseModal}>
      <div className="h-[50%] w-[50%] bg-[#111111] rounded p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-3">
            <div className="w-[300px]">
                <img src={show.backdrop_path} alt={show.title} className="rounded-lg h-[300px] w-[200px] object-cover object-right-bottom cursor-pointer" />
                <p className="font-bold text-[20px]">{show.title}</p>
                <p className="text-sm text-gray-400 mt-2">
                    {new Date(show.release_date).getFullYear()} . {timeFormat(show.runtime)}
                </p>
            </div>
            <div className="w-full flex flex-col gap-5">
                <p>{show.overview}</p>
                <div className="border border-gray-400  w-full">
                    <div className="flex gap-5 p-2 border-b border-gray-400">
                        <p>Configurations</p>
                        <SettingsIcon className="text-primary"/>
                    </div>
                    <form className="p-2">
                        <label htmlFor="date-time">add airdate</label><br />
                        <input type="datetime-local" id="date-time" className="bg-gray-700 p-1 rounded" value={airdate} onChange={(e) => setAirdate(e.target.value)} /><br />
                        <label htmlFor="show-availability">set availability</label><br />
                        <select name="show-availability" id="show-availability" className="bg-gray-700 w-[30px] rounded">
                            <option value=""></option>
                        </select>
                        <br />
                        <div className="flex justify-between items-center pt-2 pb-2">
                            <button type="submit" className="h-[35px] w-[50px] bg-primary text-white flex items-center justify-center rounded">save</button>
                            <Trash2Icon className="text-primary" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditShowModal;
