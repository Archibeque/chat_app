import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    errors: {},
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setErrors: (state, action) => {
      state.errors = action.payload.errors;
    },
  },
});

export const { setErrors } = errorSlice.actions;

export const selectErrors = (state) => state.error.errors;

export default errorSlice.reducer;
