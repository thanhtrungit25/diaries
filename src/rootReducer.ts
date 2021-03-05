import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './app/appSlice';
import authReducer from './features/auth/authSlice';
import diariesReducer from './features/diary/diariesSlice';
import entriesReducer from './features/entry/entriesSlice';
import userReducer from './features/auth/userSlice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  diaries: diariesReducer,
  entries: entriesReducer,
  user: userReducer,
});

export type RootState = typeof rootReducer;

export default rootReducer;
