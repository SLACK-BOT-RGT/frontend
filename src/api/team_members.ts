import axios from "axios";
import { API_URL } from "../config/config";

export const fetchAllUsers = async () => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const fetchTeamMembers = async () => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/team-members`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const postTeamMembers = async (data: { role: string; user_id: string; team_id: string }[]) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.post(`${API_URL}/team-members`, { data }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.delete(`${API_URL}/team-members/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.patch(`${API_URL}/team-members/${id}`, { role }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/teams`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const AddChannel = async ({ name, description }: { name: string; description: string }) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.post(`${API_URL}/teams`, { name, description }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const RemoveChannel = async ({ channel_id }: { channel_id: string; }) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.delete(`${API_URL}/teams/${channel_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const fetchStandUpConfig = async ({ team_id }: { team_id: string }) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/standup-config/${team_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.put(`${API_URL}/standup-config/${config_id}`, { ...data }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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

export const fetchStandUpResponses = async () => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/standup-responses/drafted`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const fetchMembersResponsesStatus = async ({ team_id }: { team_id: string }) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/team-members/today-status/${team_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const fetchMembersResponsesStatusToday = async ({ team_id }: { team_id: string }) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/team-members/today-status/${team_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const fetchMembersResponsesStatusWeek = async ({ team_id }: { team_id: string }) => {

    const token = localStorage.getItem("accesstoken");
    try {
        const response = await axios.get(`${API_URL}/team-members/week-status/${team_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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