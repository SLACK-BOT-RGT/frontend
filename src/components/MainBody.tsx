import { FaBars, FaBell } from "react-icons/fa6";
// import { Channel } from "../types/interfaces";
import { MdEmail } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";

interface MainBodyProps {
  isSidebarVisible: boolean;
  toggleSidebar: React.MouseEventHandler<HTMLDivElement> | undefined;
  // error: string | object | Error | null;
}

const MainBody = ({
  isSidebarVisible,
  toggleSidebar,
}: // error,
MainBodyProps) => {
  // const location = useLocation();
  // const isNewsPage = location.pathname.includes("news");
  // const isUsersPage = location.pathname.includes("users");

  return (
    <div
      className={`transition-all duration-500 ${
        isSidebarVisible ? "w-[80%]" : "w-full"
      } bg-custom-primary h-full`}
    >
      <div className="flex justify-between px-5 p-3 border-b border-gray-700 shadow-md">
        <div className="flex items-center gap-3">
          <div
            className="hover:bg-custom-secondary transition duration-300 w-8 h-8 flex items-center justify-center rounded-full"
            onClick={toggleSidebar}
          >
            <FaBars className="text-gray-500" />
          </div>
          <NavLink to="/">
            <p className="text-gray-200 font-semibold">Main Dashboard</p>
          </NavLink>
        </div>

        <div className="flex items-center gap-5">
          <FaBell className="text-gray-500" />
          <MdEmail className="text-gray-500" />
        </div>
      </div>

      {/* {error && error !== "401" && error !== "403" && (
        <div className="text-red-500 p-4">{error.toString()}</div>
      )} */}

      <div className="p-5 flex-1 h-[90vh] overflow-y-scroll no-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default MainBody;
