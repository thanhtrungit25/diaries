import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import diariesReducer from './features/diary/diariesSlice';
import entriesReducer from './features/entry/entriesSlice';
import userReducer from './features/auth/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  diaries: diariesReducer,
  entries: entriesReducer,
  user: userReducer,
});

export type RootState = typeof rootReducer;

export default rootReducer;
