import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../interfaces/AuthState";

const initialState: AuthState = {
  adminData: null,
  userData: null,
  mechData: null,
  user: null,
  mech: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredental: (state, action) => {
      state.userData = action.payload;
    },
    saveUser: (state, action) => {
      state.user = action.payload;
    },
    userLogout: (state) => {
      state.userData = null;
    },
    setAdminCredential: (state, action) => {
      state.adminData = action.payload;
    },
    adLogout: (state) => {
      state.adminData = null;
    },
    setMechCredential: (state, action) => {
      state.mechData = action.payload;
    },
    saveMech: (state, action) => {
      state.mech = action.payload;
    },
    mechLogout: (state) => {
      state.mechData = null;
    },
  },
});


export const {
  setUserCredental,
  userLogout,
  setAdminCredential,
  adLogout,
  setMechCredential,
  mechLogout,
  saveUser,
  saveMech
} = authSlice.actions;

export default authSlice.reducer;
