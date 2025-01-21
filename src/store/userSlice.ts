import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../types/interfaces';

interface UserState {
    user: IUser | null;
    users: IUser[];
}

const initialState: UserState = {
    user: null,
    users: [],
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
        setUsers: (state, action: PayloadAction<UserState['users']>) => {
            state.users = action.payload
        },
        clearUsers: (state) => {
            state.users = []
        },
    },
})

export const { setUser, clearUser, setUsers, clearUsers } = userSlice.actions

export default userSlice.reducer