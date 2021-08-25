import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/counter/userSlice';
import appReducer from '../features/counter/appSlice';
import errorReducer from '../features/counter/errorSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    error: errorReducer,
  },
});
