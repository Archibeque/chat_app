import { createSlice } from '@reduxjs/toolkit';


const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}




export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset : (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        // builder.addCase(logic, (state, action) => {
        //     state.isLoading = true;
        //     state.isError = false;
        //     state.isSuccess = false;
        //     state.message = '';
        // });
    }

})