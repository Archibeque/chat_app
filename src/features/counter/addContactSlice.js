import { createSlice } from "@reduxjs/toolkit";

export const addContactSlice = createSlice({
  name: "addContact",
  initialState: {
    cId: null,
    cName: null,
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setAddChannelContactInfo: (state, action) => {
      state.cId = action.payload.cId;
      state.cName = action.payload.cName;
    },
    reset: (state) => {
      state.cId = null;
      state.cName = null;
    },
  },
});

export const { setAddChannelContactInfo } = addContactSlice.actions;

export const selectcId = (state) => state.addContact.cId;
export const selectcName = (state) => state.addContact.cName;

export default addContactSlice.reducer;