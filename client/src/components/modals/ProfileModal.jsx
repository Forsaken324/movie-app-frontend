import { removeFromSession } from "../../common/session";
import useApp from "../../hooks/useApp";
import { Link } from "react-router-dom";
import { ClipboardList, LogOut, UserRoundPen, Wrench } from 'lucide-react';
import { useState } from "react";
import EditProfile from "../slides/EditProfile";
import {motion} from 'motion/react'


const ProfileModal = () => {
  const { user, setShowProfileScreen } = useApp();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const handleLogUserOut = () => {
    removeFromSession("quick_token");
    window.location.reload();
  };

  return (
    <motion.div
      className="flex flex-col items-end fixed inset-0 z-300 items-center"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: .5}}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      onClick={() => setShowProfileScreen(false)}
    >
      <motion.div
        className="bg-[#111111] md:w-[400px] h-auto m-3 md:m-5 rounded-lg"
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
        <div className="py-5 px-3 flex gap-2">
            <ClipboardList /><Link to={'/my-bookings'} onClick={() => setShowProfileScreen(false)}>my bookings</Link>
        </div>
        <hr className="text-gray-400" />
        {user.is_admin && (
          <>
            <div className="py-5 px-3 flex gap-2">
              <Wrench /><Link to={'/admin'} onClick={() => setShowProfileScreen(false)}>admin</Link>
            </div>
            <hr className="text-gray-400" />
          </>
        )}
        <div className="py-5 px-3">
          <button className={`flex gap-2 ${showEditProfile ? 'pb-2' : ''}`} onClick={() => setShowEditProfile(!showEditProfile)}><UserRoundPen /> edit profile</button>
          {showEditProfile && <EditProfile />}
        </div>
        <hr className="text-gray-400" />
        <div className="py-4 px-3 flex gap-2" onClick={handleLogUserOut}>
            <LogOut className="text-red-400" /><button className="text-red-400">logout</button>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default ProfileModal;
