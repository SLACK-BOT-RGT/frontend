import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchChannels } from './thunks';
import { Channel } from '../types/interfaces';

interface ChannelState {
    channels: Channel[];
    loading: boolean;
    error: string | null | Error | object;
}
const initialState: ChannelState = {
    channels: [],
    loading: false,
    error: null,
}

export const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        setOrganization: (state, action: PayloadAction<ChannelState['channels']>) => {
            state.channels = action.payload
        },
        // setOrganizationUsers: (state, action: PayloadAction<InvitesInfo[]>) => {
        //     state.organizationUsers = action.payload
        // },
        clearOrganization: (state) => {
            state.channels = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchChannels.fulfilled,
                (state, action: PayloadAction<Channel[]>) => {
                    state.channels = action.payload;
                    state.loading = false;
                    state.error = null;
                },
            )
            .addCase(
                fetchChannels.rejected,
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload as string;
                },
            )
    },
})

export const { setOrganization, clearOrganization } = organizationSlice.actions

export default organizationSlice.reducer