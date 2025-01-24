import { IoIosArrowDown } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { RootState } from "../store/store";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { IUser } from "../types/interfaces";
import AddTeam from "./AddTeam";
import { ScrollArea } from "./ui/scroll-area";
import { clearChannels } from "../store/channelsSlice";
import { clearUser, clearUsers } from "../store/userSlice";

interface SideBarProps {
  id?: number;
  isSidebarVisible: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isSidebarVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const { channels }: { channels: Channel[] } = useOutletContext();
  const { channels } = useAppSelector((state: RootState) => state.channels);
  const { channel_id } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // if (loading) return <p>Loading...</p>;

  // if (error) return <p>{error.toString()}</p>;

  const storedUserData = localStorage.getItem("userData");

  let userData: IUser | null = null;
  if (storedUserData) {
    try {
      userData = JSON.parse(storedUserData);
    } catch (error) {
      console.error("Failed to parse userData from localStorage", error);
    }
  }

  if (!userData) {
    return <p>Login</p>;
  }

  return (
    <div
      className={`${
        isSidebarVisible ? "w-[20%] p-5" : "w-0 p-0"
      } bg-custom-secondary h-full flex flex-col transition-all duration-500 overflow-hidden`}
    >
      <div className="flex-1">
        <div className="pt-2 pb-10 border-b border-gray-400">
          <div className="bg-custom-primary w-14 h-w-14 rounded-full p-[2px]">
            <img
              className="w-14 h-w-14 rounded-full"
              src="/src/assets/female.jpg"
              alt="description"
            />
          </div>
          <p className="text-gray-300">{userData.email}</p>
          <p className="text-white">{userData.name}</p>
        </div>

        {/* Drop Down */}
        <div
          className="flex items-center p-2 cursor-pointer mt-3"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <IoIosArrowDown
            className={`text-white text-xl mr-2 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <p className="flex-1 font-semibold text-white">Channels</p>

          {userData.is_admin && <AddTeam />}
        </div>

        {/* List of drop down */}
        {isOpen && (
          <ScrollArea className="h-[50%] w-[100%] p-4">
            <div className="mt-2">
              {channels?.map((channel, index) => (
                <NavLink
                  to={`channel/${channel.id}`}
                  key={index}
                  className="group flex items-center gap-2 p-2 cursor-pointer transition hover:bg-gray-500 rounded duration-500"
                >
                  <div
                    className={`${
                      channel_id == channel.id ? "bg-red-300" : "bg-blue-300"
                    } w-3 h-3 rounded-full`}
                  ></div>
                  <p className="text-gray-400 group-hover:text-white mb-1">
                    #{channel.name}
                  </p>
                </NavLink>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="flex justify-between">
        <IoSettingsSharp className="text-2xl text-right cursor-pointer text-white transform transition-transform duration-300 hover:scale-110" />
        <TbLogout
          className="text-2xl text-right cursor-pointer text-white transform transition-transform duration-300 hover:scale-110"
          onClick={() => {
            localStorage.setItem("userData", "");
            localStorage.setItem("accesstoken", "");
            dispatch(clearChannels());
            dispatch(clearUser());
            dispatch(clearUsers());
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

export default SideBar;
