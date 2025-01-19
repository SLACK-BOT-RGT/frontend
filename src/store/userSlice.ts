import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/interfaces';


const initialState: UserState = {
    user: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState['user']>) => {
            state.user = action.payload
        },
        clearUser: (state) => {
            state.user = null
        },
    },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer