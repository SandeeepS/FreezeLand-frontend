import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../interfaces/AuthState";

export interface CouterState {
  value: number;
}

console.log("local storage is ", localStorage);
const initialState:AuthState = {
  adminData: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo") as string)
    : null,
  userData: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
  mechData: localStorage.getItem("mechInfo")
    ? JSON.parse(localStorage.getItem("mechInfo") as string)
    : null,
  user: localStorage.getItem("userAddress")
    ? JSON.parse(localStorage.getItem("userAddress") as string)
    : null,
  mech: localStorage.getItem("mechAddress")
    ? JSON.parse(localStorage.getItem("mechAddress") as string)
    : null,
};


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredental: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    saveUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userAddress", JSON.stringify(action.payload));
    },
    userLogout: (state) => {
      state.userData = null;
      localStorage.removeItem("userInfo");
    },
    setAdminCredential: (state, action) => {
      state.adminData = action.payload;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    adLogout: (state) => {
      state.adminData = null;
      localStorage.removeItem("adminInfo");
    },
    setMechCredential: (state, action) => {
      state.mechData = action.payload;
      localStorage.setItem("mechInfo", JSON.stringify(action.payload));
    },
    saveMech: (state, action) => {
      state.mech = action.payload;
      localStorage.setItem("userAddress", JSON.stringify(action.payload));
    },
    mechLogout: (state) => {
      state.mechData = null;
      localStorage.removeItem("mechInfo");
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
