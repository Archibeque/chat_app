import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { toast } from 'react-toastify';


const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}


export const register = createAsyncThunk('auth/register', async (newUser, { rejectWithValue }) => {
    try {
        return await authService.register(newUser);

    } catch (error) {
        
        const message = (error.response && error.response.data && error.response.data.items) || 
        error.message || error.toString()

        console.log(message)

        
        

        return rejectWithValue(toast.error(message))
    }
    
});


export const login = createAsyncThunk('auth/login', async (userdetails, { rejectWithValue }) => {
    try {
        return await authService.login(userdetails);

    } catch (error) {
        
        const message = (error.response && error.response.data) || 
        error.message || error.toString()
        
        return rejectWithValue(message)
    }
});


export const logout = createAsyncThunk('auth/logout', async() => {
    await authService.logout();
})





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
        builder.addCase(register.pending, (state, action) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
        builder.addCase(login.pending, (state, action) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.user = null;
            state.message = action.payload;
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            
        })
    }
})


export const { reset } = authSlice.actions;
export default authSlice.reducer;