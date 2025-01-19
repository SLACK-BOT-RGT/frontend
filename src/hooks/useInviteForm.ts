import { useState } from "react";
import { toast } from "react-toastify";
import { assignUserToOrg, createUser, sendMagicLink } from "../api/api";

interface InviteFormProps {
    orgId: string;
    onDone: () => void;
    setIsOpen: (value: boolean) => void;
}
export const useInviteForm = ({ orgId, setIsOpen, onDone }: InviteFormProps) => {
    const [values, setValues] = useState({ name: "", email: "", role: "Viewer" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleInvites(values);
    };

    const handleInvites = async (values: {
        name: string;
        email: string;
        role: string;
    }) => {
        try {
            setIsOpen(false);
            toast("Loading...", {
                position: "top-right",
                isLoading: true,
            });
            const { name, email, role } = values;

            const userResponse = await createUser({ name, email });

            if (!userResponse) throw new Error("Error in creating user");

            const userId = userResponse.user.id;

            await assignUserToOrg({ orgId, role, userId });

            await sendMagicLink({ email });

            toast.dismiss();
            toast.success("Invitation successfully sent !", {
                position: "top-right",
            });
            onDone();
        } catch (error) {
            toast.dismiss();
            console.error(error);
            toast.error("An error occurred while sending the invite. !", {
                position: "top-right",
            });
            onDone();
        }
    };

    return { handleChange, handleSubmit, values }
}