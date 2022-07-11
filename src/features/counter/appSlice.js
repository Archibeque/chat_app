import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    channelId: null,
    channelName: null,
    contactId: null,
    contactName: null,
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setChannelInfo: (state, action) => {
      state.channelId = action.payload.channelId;
      state.channelName = action.payload.channelName;
      state.contactId = action.payload.contactId;
      state.contactName = action.payload.contactName;
    },
    
    
    reset: (state) => {
      state.channelId = null;
      state.channelName = null;
      state.contactId = null;
      state.contactName = null;

    },
  },

});

export const { setChannelInfo, reset } = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;
export const selectContactId = (state) => state.app.contactId;
export const selectContactName = (state) => state.app.contactName;

export default appSlice.reducer;
