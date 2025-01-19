import axios from "axios";
import { API_URL } from "../config/config";

export const fetchOrganizationUsers = async ({ organizationId }: { organizationId: string }) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/organization/${organizationId}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data: response.data };
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const handlePassCode = async ({ passcode, accessToken }: { passcode: string, accessToken: string | null }) => {

    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            passcode
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { data, accesstoken } = response.data;

        if (response.status == 200) {
            localStorage.setItem("userData", JSON.stringify(data));
            localStorage.setItem("accesstoken", accesstoken);
        }


    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}


export const removeOrganizationUser = async ({ user_id, organizationId }: { user_id: string, organizationId: string | undefined }) => {

    const token = localStorage.getItem("accesstoken");

    try {
        const response = await axios.delete(`${API_URL}/organization/${organizationId}/users/${user_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}


export const handleResend = async ({ email }: { email: string }) => {
    try {
        const token = localStorage.getItem("accesstoken");

        const response = await axios.post(
            `${API_URL}/magic-links/send-magic-link`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }
}


export const handleRevokeInvite = async ({ user_id, organizationId }: { user_id: string, organizationId: string | undefined }): Promise<boolean> => {
    try {
        if (!organizationId) throw new Error('Organization id is required');

        const token = localStorage.getItem("accesstoken");
        await axios.post(
            `${API_URL}/magic-links/revoke`,
            { user_id, organizationId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return true;
    } catch (error) {
        console.log(error);

        return false
    }
}

export const createUser = async ({ name, email }: { name: string, email: string }) => {
    try {
        const token = localStorage.getItem("accesstoken");
        const userResponse = await axios.post(
            `${API_URL}/users`,
            {
                name,
                email,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return userResponse.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(String(error));
    }
}

export const updateUser = async ({ name, phoneNumber, userId }: { name: string, phoneNumber: string, userId: number | undefined }) => {
    try {
        if (!userId) return;

        const token = localStorage.getItem("accesstoken");
        const userResponse = await axios.patch(
            `${API_URL}/users/${userId}`,
            {
                name,
                phone_number: phoneNumber,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return userResponse.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(String(error));
    }
}

export const assignUserToOrg = async ({ orgId, userId, role }: { orgId: string, userId: string, role: string }) => {
    try {
        const token = localStorage.getItem("accesstoken");
        await axios.post(
            `${API_URL}/organization/${orgId}/${userId}`,
            {
                role,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(String(error));
    }
}

export const updateUserOrgInfo = async ({ orgId, userId, role }: { orgId: string, userId: string, role: string }) => {
    try {
        const token = localStorage.getItem("accesstoken");
        await axios.patch(
            `${API_URL}/organization/${orgId}/${userId}`,
            {
                role,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(String(error));
    }
}

export const sendMagicLink = async ({ email }: { email: string }) => {
    try {
        const token = localStorage.getItem("accesstoken");
        await axios.post(
            `${API_URL}/magic-links/send-magic-link`,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(String(error));
    }
}

export const deleteUser = async ({ user_id }: { user_id: string }): Promise<boolean> => {
    try {
        const token = localStorage.getItem("accesstoken");
        await axios.delete(
            `${API_URL}/users/${user_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return true;
    } catch (error) {
        console.log(error);

        return false
    }
}