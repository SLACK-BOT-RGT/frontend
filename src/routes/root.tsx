import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./Layout";
import PassCode from "../Pages/Passcode";
import Login from "../Pages/Login";
import ChannelDashBoard from "../Pages/ChannelDashBoard";
import StandupDashboard from "../Pages/StandupDashboard";

const isAuthenticated = () => {
  return localStorage.getItem("accesstoken") !== null; // Fixed condition
};

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const queryClient = new QueryClient();

const Root: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/passcode" element={<PassCode />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute element={<Layout />} />}>
            <Route index element={<StandupDashboard />} />
            <Route path="channel/:channel_id" element={<ChannelDashBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default Root;
