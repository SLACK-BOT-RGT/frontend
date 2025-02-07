import { useState } from "react";
import { sendMagicLink } from "../api/api";
import { Loader2 } from "lucide-react";

const Login: React.FC = () => {
  const [values, setValues] = useState({ email: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    await sendMagicLink({ ...values });
    setLoading(false);
    alert("Link has been sent to email!... Check your mail");
    setValues({ email: "" });
  };

  return (
    <div className="flex w-screen h-screen bg-custom-secondary justify-center items-center">
      <form onSubmit={handleSubmit}>
        <p className="text-gray-300 text-xl">Please enter your email</p>
        <div className="w-full bg-custom-primary flex flex-wrap justify-between p-5 mt-5">
          <div className="w-100%">
            <label htmlFor="email" className="block text-gray-500 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-transparent rounded transition duration-500 outline-none focus:ring-2 focus:ring-blue-300 bg-custom-secondary text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-5 py-5">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-full flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin h-6 w-6 text-white" />
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
