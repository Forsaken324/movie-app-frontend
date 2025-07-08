import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminNav = () => {
    return (
        <div className="flex items-center justify-betweenn px-6 md:px-10 h-16 border-b border-gray-300/30">
            <Link to={'/'}><img src={assets.logo} alt='quickshow logo'/></Link>
        </div>
    )
}

export default AdminNav;