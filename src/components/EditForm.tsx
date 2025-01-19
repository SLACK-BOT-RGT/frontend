import { useEditForm } from "../hooks/useEditForm";
import { InvitesInfo } from "../types/interfaces";

interface EditFormProps {
  orgId: string;
  onDone: () => void;
  setIsOpen: (value: boolean) => void;
  organizationUsers: InvitesInfo[];
  selectedUser: number | null;
}
const EditForm = ({
  orgId,
  setIsOpen,
  onDone,
  organizationUsers,
  selectedUser,
}: EditFormProps) => {
  const user = organizationUsers.find((item) => item.id == selectedUser);

  const { handleChange, handleSubmit, values } = useEditForm({
    orgId,
    setIsOpen,
    onDone,
    user,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full bg-custom-primary flex flex-wrap justify-between p-5">
        <div className="w-[45%]">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-transparent rounded transition duration-500 outline-none focus:ring-2 focus:ring-blue-300 bg-custom-secondary"
          />
        </div>

        <div className="w-[45%]">
          <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
            Contact
          </label>
          <input
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-transparent rounded transition duration-500 outline-none focus:ring-2 focus:ring-blue-300 bg-custom-secondary"
          />
        </div>

        <div className="w-[100%] pt-5">
          <p>Role</p>
          <div className="flex items-start gap-4 mt-2">
            <input
              type="radio"
              id="manager"
              name="role"
              value="Manager"
              checked={values.role === "Manager"}
              onChange={handleChange}
              className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="manager" className="block text-gray-200 mb-2">
              Manager
            </label>
          </div>
          <div className="flex items-start gap-4 mt-5">
            <input
              type="radio"
              id="viewer"
              name="role"
              value="Viewer"
              checked={values.role === "Viewer"}
              onChange={handleChange}
              className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="viewer" className="block text-gray-200 mb-2">
              Viewer
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-5 p-5">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default EditForm;
