import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import channelsReducer from './channelsSlice'
import userReducer from './userSlice'

// Redux-Persist configuration
const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['channels'],
};

const rootReducer = combineReducers({
    channels: channelsReducer,
    users: userReducer,
});

// Create persisted reducer
export const persistedReducer = persistReducer(persistConfig, rootReducer);
