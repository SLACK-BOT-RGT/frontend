import { useState } from "react";
import { toast } from "react-toastify";
import { updateUser, updateUserOrgInfo } from "../api/api";
import { InvitesInfo } from "../types/interfaces";

interface InviteFormProps {
    orgId: string;
    onDone: () => void;
    setIsOpen: (value: boolean) => void;
    user: InvitesInfo | undefined
}

export const useEditForm = ({ orgId, setIsOpen, onDone, user }: InviteFormProps) => {
    const org = user?.Organizations.find((item) => item.id.toString() == orgId)

    const [values, setValues] = useState({
        name: user?.name ?? "",
        phoneNumber: user?.phone_number ?? "",
        role: org?.UserOrganization?.role ?? "",
    });

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
        phoneNumber: string;
        role: string;
    }) => {
        try {
            setIsOpen(false);
            toast("Loading...", {
                position: "top-right",
                isLoading: true,
            });
            const { name, phoneNumber, role } = values;

            const userResponse = await updateUser({ name, phoneNumber, userId: user?.id });

            if (!userResponse) throw new Error("Error in updating user");

            const userId = userResponse.user.id;

            await updateUserOrgInfo({ orgId, role, userId })


            toast.dismiss();
            toast.success("Data updated successfully !", {
                position: "top-right",
            });
            onDone();
        } catch (error) {
            toast.dismiss();
            console.error(error);
            toast.error("An error occurred while updating user data. !", {
                position: "top-right",
            });
            onDone();
        }
    };

    return { handleChange, handleSubmit, values }
}