import { createSlice } from "@reduxjs/toolkit";

export const contactAppSlice = createSlice({
  name: "contactApp",
  initialState: {
    contactChatId: null,
    contactcreatorId: null,
    contactReceiverId: null,
    conReceiverName: null,
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setChannelInfo: (state, action) => {
      state.channelAdmin = action.payload.channelAdmin;
      state.channelId = action.payload.channelId;
      state.channelName = action.payload.channelName;
      state.contactId = action.payload.contactId;
      state.contactName = action.payload.contactName;
    },
    
    
    reset: (state) => {
      state.channelAdmin = null
      state.channelId = null;
      state.channelName = null;
      state.contactId = null;
      state.contactName = null;

    },
  },

});

export const { setChannelInfo, reset } = contactAppSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectContactId = (state) => state.app.contactId;

export default contactAppSlice.reducer;
