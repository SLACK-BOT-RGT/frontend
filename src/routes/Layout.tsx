// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// import { fetchChannels } from "../store/thunks";
import { useQuery } from "@tanstack/react-query";
// import { RootState } from "../store/store";
import { useAppDispatch } from "../hooks/hooks";
// import { useFetchData } from "../hooks/useFetchData";
import Loading from "../components/Loading";
import SideBar from "../components/SideBar";
import MainBody from "../components/MainBody";
import { fetchAllChannels } from "../api/team_members";
import { setChannels } from "../store/channelsSlice";
import { Toaster } from "../components/ui/toaster"

const Layout = () => {
  const { data: channels, isLoading } = useQuery({
    queryFn: fetchAllChannels,
    queryKey: ["channels"],
  });

  // const { channels, loading, error } = useAppSelector(
  //   (state: RootState) => state.channels
  // );
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const { orgId } = useParams();

  // useFetchData(orgId);

  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    dispatch(setChannels(channels));
  }, [dispatch, channels]);

  // useEffect(() => {
  //   console.log('====================================');
  //   console.log("In");
  //   console.log('====================================');
  //   if (error === "401" || error === "403") navigate("/login");
  // }, [error, navigate]);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  if (isLoading) return <Loading />;

  return (
    <div className="flex w-screen h-screen justify-end bg-custom-secondary">
      <SideBar isSidebarVisible={isSidebarVisible} />

      <MainBody
        // error={error}
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
      />
      <Toaster />
    </div>
  );
};

export default Layout;
