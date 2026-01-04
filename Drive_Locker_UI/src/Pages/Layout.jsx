import { Outlet } from "react-router-dom";
import Menubar from "../Components/Menubar";
import loginbg from "../assets/loginbg.jpg";
import { useContext } from "react"; // ✅ ADDED
import { AppContext } from "../context/AppContext"; // ✅ ADDED
import Loader from "../Components/Loader"; // ✅ ADDED

const Layout = () => {
    // Get the loading state from the context
    const { isLoading } = useContext(AppContext); // ✅ ADDED

    return (
        <div
            className="min-h-screen flex flex-col font-[Poppins] text-white bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${loginbg})` }}
        >
            <div className="min-h-screen flex flex-col bg-black/75">
                <Menubar />
                <main className="flex-grow flex items-center justify-center w-full px-6 py-10">
                    {/* ✅ CHANGED: Conditionally render Loader or Outlet */}
                    {isLoading ? <Loader /> : <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default Layout;