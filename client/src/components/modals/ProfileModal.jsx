import { removeFromSession } from "../../common/session";
import useApp from "../../hooks/useApp";
import { Link } from "react-router-dom";
import { ClipboardList, LogOut } from 'lucide-react';

const ProfileModal = () => {
  const { user, showProfileScreen, setShowProfileScreen } = useApp();

  const handleLogUserOut = () => {
    removeFromSession("quick_token");
    window.location.reload();
  };

  return (
    <div
      className="flex flex-col items-end absolute z-300 items-center h-full w-full"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      onClick={() => setShowProfileScreen(false)}
    >
      <div
        className="bg-[#111111] w-[400px] h-[200px] m-5 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 flex gap-3">
          <div
            className="h-[50px] w-[50px] rounded-full overflow-hidden"
          >
            <img
              src={user.image_path}
              alt="profile photo"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold">{user.firstname} {user.lastname}</p>
            <p>{user.email}</p>
          </div>
        </div>
        <hr className="text-gray-400" />
        <div className="py-5 px-3 flex gap-2 font-bold">
            <ClipboardList /><Link to={'/my-bookings'}>my bookings</Link>
        </div>
        <hr className="text-gray-400" />
        <div className="py-4 px-3 flex gap-2" onClick={handleLogUserOut}>
            <LogOut className="text-red-400" /><button className="text-red-400">Logout</button>
        </div>
      </div>

    </div>
  );
};

export default ProfileModal;
