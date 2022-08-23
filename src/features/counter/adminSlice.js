import { createSlice } from '@reduxjs/toolkit';


const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
   channelAdmin: null
}




export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setChannelAdmin: (state, action) => {
            state.channelAdmin = action.payload.channelAdmin;
        },
        
    },
  

})

export const { setChannelAdmin } = adminSlice.actions;
export const selectChannelAdmin = (state) => state.admin.channelAdmin;

export default adminSlice.reducer;
