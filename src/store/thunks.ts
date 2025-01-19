import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../config/config";


export const fetchChannels = createAsyncThunk(
    "channels/fetchChannels",
    async (_arg, thunkAPI) => {
        // const token = localStorage.getItem("accesstoken");

        try {
            const response = await axios.get(`${API_URL}/teams`, {
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
                // withCredentials: true
            });

            return response.data.data;
        } catch (error: unknown) {
            let errorMessage = "Something went wrong";



            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    errorMessage = error.response?.status.toString();
                } else {
                    errorMessage = error.response?.data?.message || error.message || errorMessage;

                }
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

