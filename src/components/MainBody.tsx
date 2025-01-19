import { FaBars, FaBell } from "react-icons/fa6";
import { Channel } from "../types/interfaces";
import { MdEmail } from "react-icons/md";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";

interface MainBodyProps {
  isSidebarVisible: boolean;
  toggleSidebar: React.MouseEventHandler<HTMLDivElement> | undefined;
  channels: Channel[];
  error: string | object | Error | null;
}

const MainBody = ({
  isSidebarVisible,
  toggleSidebar,
  channels,
  error,
}: MainBodyProps) => {
  const { orgId } = useParams();

  const location = useLocation();
  const isNewsPage = location.pathname.includes("news");
  const isUsersPage = location.pathname.includes("users");

  const organization = channels.find(
    (item) => item.id.toString() === orgId
  );
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
          <p className="text-gray-200 font-semibold">
            {organization?.name ||
              (channels.length
                ? "Select Organization"
                : "No Organizations Available")}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <FaBell className="text-gray-500" />
          <MdEmail className="text-gray-500" />
        </div>
      </div>

      {error && error !== "401" && error !== "403" && (
        <div className="text-red-500 p-4">{error.toString()}</div>
      )}

      <div className="p-5 flex-1 h-[90vh] overflow-y-scroll no-scrollbar">
        {orgId && (
          <div className="flex mt-5 border-b border-gray-700">
            <NavLink
              to={`org/${orgId}/news`}
              className={`p-2 border-b text-gray-500 cursor-pointer border-custom-primary transition duration-500 ${
                isNewsPage ? "border-blue-500 text-white" : ""
              }`}
            >
              <h3>News</h3>
            </NavLink>
            <NavLink
              to={`org/${orgId}/users`}
              className={`p-2 border-b text-gray-500 cursor-pointer border-custom-primary transition duration-500 ${
                isUsersPage ? "border-blue-500 text-white" : ""
              }`}
            >
              <h3>Users</h3>
            </NavLink>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
};

export default MainBody;
