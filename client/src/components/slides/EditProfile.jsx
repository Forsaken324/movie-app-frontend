import useApp from "../../hooks/useApp";
import {motion} from 'motion/react'

const EditProfile = () => {
    const {user} = useApp();

    const editUserInfo = () => {

    }
  return (
    <motion.div
     className="h-auto border border-gray-400 my-3  rounded-xl"
     initial={{marginTop: 20}}
     animate={{marginTop: 0}}
     transition={{duration: 1}}
    >
      <form className="p-3">
        <label htmlFor="">first name</label>
        <br />
        <input type="text" className="border rounded-md mb-2 border-gray-400 py-1 px-2 outline-orange-300" value={user.firstname} />
        <br />
        <label htmlFor="">last name</label>
        <br />
        <input type="text" className="border rounded-md mb-2 border-gray-400 py-1 px-2 outline-orange-300" value={user.lastname} />
        <br />
        <label htmlFor="">new password</label>
        <br />
        <input type="password" className="border rounded-md mb-2 border-gray-400 py-1 px-2 outline-orange-300"/>
        <br />
        <label htmlFor="profile-image">upload profile pic</label>
        <br />
        <input type="file" id="profile-image" className="hidden" />
        <div className="flex gap-4">
            <button className="p-2 bg-primary rounded-lg my-2">save changes</button>
            <button className="p-2 bg-gray-800 my-2 rounded-lg">reset</button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProfile;
