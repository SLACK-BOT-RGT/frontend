import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
// import News from "./news";
// import Users from "./users";
import PassCode from "./passcode";
import Login from "../Pages/Login";
import ChannelDashBoard from "../Pages/ChannelDashBoard";

// const isAuthenticated = () => {
//   return localStorage.getItem("accesstoken") !== null;
// };

// const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
//   return isAuthenticated() ? <Navigate to="/login" /> : element;
// };

const Root: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/passcode" element={<PassCode />} />

        {/* <Route path="/" element={<PrivateRoute element={<Layout />} />}> */}
        <Route path="/" element={<Layout />} >
          <Route
            index
            element={
              <div className="flex justify-center items-center pt-10">
                <p className="text-gray-300">Select Channel</p>
              </div>
            }
          />
          <Route path="channel/">
          <Route path=":channel-id" element={<ChannelDashBoard/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
