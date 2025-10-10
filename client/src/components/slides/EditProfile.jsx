import { motion } from "motion/react";
import { assets } from "../../assets/assets";
import { useState } from "react";
import axios from "axios";
import { lookInSession } from "../../common/session";
import toast from "react-hot-toast";
import useApp from "../../hooks/useApp";

const EditProfile = () => {
  const { user } = useApp();
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState(null);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { setShowProfileScreen } = useApp();
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const editUserInfo = (e) => {
    e.preventDefault();
    setLoading(true);
    const token = lookInSession("quick_token");
    if (!token) {
      scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      setShowAuthScreen(true);
      return toast.error("Sorry, you need to be logged in first");
    }
    let formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("old_password", oldPassword);

    if (newPassword !== "") {
      formData.append("new_password", newPassword);
    }
    if (updatedProfilePicture) {
      formData.append("profile_image", updatedProfilePicture);
    }
    axios
      .put(BACKEND_URL + "/user/edit-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status) {
          toast.success("Profile updated successfully");
          setShowProfileScreen(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return;
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        switch (error.status) {
          case 400:
            setLoading(false);
            toast.error("old password and new password do not match");
            break;
          case 408:
            setLoading(false);
            toast.error("profile picture not updated, an error occured");
            break;
          default:
            setLoading(false);
            toast.error("sorry, an error occured");
            break;
        }
      });
  };

  const resetForm = (e) => {
    e.preventDefault();
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <motion.div
      className="h-auto border border-gray-400 my-3  rounded-xl"
      initial={{ marginTop: 20 }}
      animate={{ marginTop: 0 }}
      transition={{ duration: 1 }}
    >
      <form className="p-3">
        <label htmlFor="firstname">first name</label>
        <br />
        <input
          type="text"
          id="firstname"
          className="border rounded-md mb-2 border-gray-400 py-1 px-2 outline-orange-300"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <br />
        <label htmlFor="lastname">last name</label>
        <br />
        <input
          type="text"
          id="lastname"
          className="border rounded-md mb-2 border-gray-400 py-1 px-2 outline-orange-300"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <br />
        <label htmlFor="old-password">old password</label>
        <br />
        <input
          type="text"
          id="old-password"
          className="border rounded-md mb-2 border-gray-400 py-1 px-2 outline-orange-300"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <br />
        <label htmlFor="new-password">new password</label>
        <br />
        <input
          type="password"
          id="new-password"
          className="border rounded-md mb-2 border-gray-400 py-1 px-2 outline-orange-300"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br />
        <label htmlFor="profile-image">
          <span className="">update profile picture </span>
          <img src={assets.uploadArea} alt="" />
        </label>
        <br />
        <input
          type="file"
          id="profile-image"
          className="hidden"
          onChange={(e) => setUpdatedProfilePicture(e.target.files[0])}
        />
        {updatedProfilePicture && <p>{updatedProfilePicture.name}</p>}
        <div className="flex gap-4">
          <button
            className={`p-2 bg-primary rounded-lg my-2 ${
              loading ? "disabled cursor-not-allowed opacity-50" : ""
            }`}
            onClick={editUserInfo}
          >
            save changes
          </button>
          <button
            className="p-2 bg-gray-800 my-2 rounded-lg"
            onClick={resetForm}
          >
            reset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProfile;
