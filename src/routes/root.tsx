import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
// import News from "./news";
// import Users from "./users";
import PassCode from "./passcode";
import Login from "../Pages/Login";
import ChannelDashBoard from "../Pages/ChannelDashBoard";
import StandupDashboard from "../Pages/StandupDashboard";

// const isAuthenticated = () => {
//   return localStorage.getItem("accesstoken") !== null;
// };

// const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
//   return isAuthenticated() ? <Navigate to="/login" /> : element;
// };

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Root: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/passcode" element={<PassCode />} />

          {/* <Route path="/" element={<PrivateRoute element={<Layout />} />}> */}
          <Route path="/" element={<Layout />}>
            <Route index element={<StandupDashboard />} />
            <Route path="channel/">
              <Route path=":channel_id" element={<ChannelDashBoard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default Root;
