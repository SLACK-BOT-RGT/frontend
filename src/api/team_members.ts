import axios from "axios";
import { API_URL } from "../config/config";

export const fetchAllUsers = async () => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/users`, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        console.log('====================================');
        console.log("response=>", response.data.data);
        console.log('====================================');
        return response.data.data;
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const fetchTeamMembers = async () => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/team-members`, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        console.log('====================================');
        console.log("response=>", response.data.data);
        console.log('====================================');
        return response.data.data;
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const postTeamMembers = async (data: { role: string; user_id: string; team_id: string }[]) => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.post(`${API_URL}/team-members`, { data }, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        console.log('====================================');
        console.log("response=>", response.data.data);
        console.log('====================================');
        return { success: true, data: response.data.data };
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const deleteTeamMember = async ({ id }: { id: number }) => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.delete(`${API_URL}/team-members/${id}`, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        return response.data.data;
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const updateTeamMember = async ({ role, id }: { role: string, id: number }) => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.patch(`${API_URL}/team-members/${id}`, { role }, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        return response.data.data;
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const fetchAllChannels = async () => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/teams`, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        console.log('====================================');
        console.log("response=>", response.data.data);
        console.log('====================================');
        return response.data.data;
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const fetchStandUpConfig = async ({ team_id }: { team_id: string }) => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/standup-config/${team_id}`, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        console.log('====================================');
        console.log("response=>", response.data.data);
        console.log('====================================');
        return response.data.data;
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}

export const updateStandUpConfig = async ({
    data,
    config_id
}: {
    data: {
        team_id: string; questions: string[];
        reminder_days: string[];
        reminder_time: string;
        is_active: boolean;
    }, config_id: number
}) => {

    // const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.put(`${API_URL}/standup-config/${config_id}`, { ...data }, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        console.log('====================================');
        console.log("response=>", response.data.data);
        console.log('====================================');
        return response.data.data;
    } catch (error: unknown) {

        console.log('====================================');
        console.log(error);
        console.log('====================================');
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return { success: false, status: 401 };
            }
        }
        throw error;
    }

}