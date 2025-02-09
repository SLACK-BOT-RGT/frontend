import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import { fetchChannels } from './thunks';
import { Channel, ITeamMember, StandupResponse } from '../types/interfaces';



interface ChannelState {
    channels: Channel[];
    teamMembers: ITeamMember[];
    standupResponses: StandupResponse[];
    loading: boolean;
    error: string | null | Error | object;
}
const initialState: ChannelState = {
    channels: [],
    teamMembers: [],
    standupResponses: [],
    loading: false,
    error: null,
}

export const organizationSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels: (state, action: PayloadAction<ChannelState['channels']>) => {
            state.channels = action.payload
        },
        setTeamMembers: (state, action: PayloadAction<ChannelState['teamMembers']>) => {
            state.teamMembers = action.payload
        },
        setStandupResponses: (state, action: PayloadAction<ChannelState['standupResponses']>) => {
            state.standupResponses = action.payload
        },
        clearChannels: (state) => {
            state.channels = []
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchChannels.pending, (state) => {
    //             state.loading = true;
    //         })
    //         .addCase(
    //             fetchChannels.fulfilled,
    //             (state, action: PayloadAction<Channel[]>) => {
    //                 state.channels = action.payload;
    //                 state.loading = false;
    //                 state.error = null;
    //             },
    //         )
    //         .addCase(
    //             fetchChannels.rejected,
    //             (state, action: PayloadAction<unknown>) => {
    //                 state.loading = false;
    //                 state.error = action.payload as string;
    //             },
    //         )
    // },
})

export const { setChannels, clearChannels, setTeamMembers, setStandupResponses } = organizationSlice.actions

export default organizationSlice.reducer