import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/counter/authSlice';
import appReducer from '../features/counter/appSlice';
import errorReducer from '../features/counter/errorSlice';




export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    error: errorReducer,
    
  },
});
