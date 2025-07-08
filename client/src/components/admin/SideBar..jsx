import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from "lucide-react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";


const SideBar = () => {

    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }


    const adminNavLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
    ]


    return (
        <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
            <img src={user.imageUrl} alt={user.firstName} className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto" />
            <div className="flex flex-col items-center md:flex-row md:gap-1">
                <p>{user.firstName}</p>
                <p>{user.lastName}</p>
            </div>
            <div className="w-full">
                {adminNavLinks.map((link, index) => (
                    <NavLink key={index} to={link.path} className={({ isActive }) => `relative flex items-center w-full max-md:justify-center gap-2 py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${isActive && 'bg-primary/15 text-primary group'}`} end>
                        {({ isActive }) => ( // the isActive is specific to the react-router-dom component navlink, javascript does not traditionally have an isActive state.
                            <>
                                <link.icon className="w-5 h-5" />
                                <p className="max-md:hidden">{link.name}</p>
                                <span className={`h-10 w-1.5 rounded-l absolute right-0 ${isActive && 'bg-primary'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default SideBar;