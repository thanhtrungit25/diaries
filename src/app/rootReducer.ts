import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import authReducer from '../features/auth/authSlice';
import diariesReducer from '../features/diary/diariesSlice';
import entriesReducer from '../features/entry/entriesSlice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  diaries: diariesReducer,
  entries: entriesReducer,
});

export type RootState = typeof rootReducer;

export default rootReducer;
