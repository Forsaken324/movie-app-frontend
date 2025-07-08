import { Outlet } from "react-router-dom";
import AdminNav from "../../components/admin/AdminNav";
import SideBar from "../../components/admin/SideBar.";

const Layout = () => {
    return (
        <>
            <AdminNav />
            <div className="flex">
                <SideBar />
                <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh  - 64px) overflow-y-autp">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout;

// flex-1 means use up the entire space