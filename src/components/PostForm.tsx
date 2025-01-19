import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks/hooks";
import { createPost, fetchPosts } from "../store/postsSlice";

const PostForm = ({
  orgId,
  setIsOpen,
  onDone,
}: {
  orgId: string;
  onDone: () => void;
  setIsOpen: (value: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState({ title: "", description: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePost(values);
  };

  const handlePost = async (values: { title: string; description: string }) => {
    try {
      setIsOpen(false);
      const { title, description } = values;

      toast.loading("Creating post...");

      await dispatch(
        createPost({ title, description, organization_id: orgId })
      ).unwrap();

      if (orgId) {
        await dispatch(fetchPosts({ orgId: orgId }));
      }

      toast.dismiss();
      toast.success("Post created successfully!");
      onDone();
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("An error occurred while creating the post.", {
        position: "top-right",
      });
      onDone();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full bg-custom-primary flex flex-wrap justify-between p-5">
        <div className="w-[45%]">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-transparent rounded transition duration-500 outline-none focus:ring-2 focus:ring-blue-300 bg-custom-secondary"
            required
          />
        </div>

        <div className="w-[45%]">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-transparent rounded transition duration-500 outline-none focus:ring-2 focus:ring-blue-300 bg-custom-secondary"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-5 p-5">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Post
        </button>
      </div>
    </form>
  );
};

export default PostForm;
