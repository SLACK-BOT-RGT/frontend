import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handlePassCode } from "../api/team_members";

const PassCode: React.FC = () => {
  const [passcode, setPassCode] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const accessToken = params.get("accesstoken");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePassCode({ passcode, accessToken });
    navigate("/");
  };

  return (
    <div className="flex w-screen h-screen bg-custom-secondary justify-center items-center">
      <form onSubmit={handleSubmit}>
        <p className="text-gray-300 text-xl">Please enter your passcode</p>
        <div className="w-full bg-custom-primary flex flex-wrap justify-between p-5 mt-5">
          <div className="w-100%">
            <label htmlFor="email" className="block text-gray-500 mb-2">
              Pass code
            </label>
            <input
              type="number"
              id="passcode"
              name="passcode"
              value={passcode}
              onChange={(e) => setPassCode(e.target.value)}
              className="w-full px-4 py-2 border border-transparent rounded transition duration-500 outline-none focus:ring-2 focus:ring-blue-300 bg-custom-secondary text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-5 py-5">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-full"
          >
            Invite
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassCode;
