import { createSlice } from "@reduxjs/toolkit";

export interface CouterState{
    value:number
}

const initialState = {
    userData:localStorage.getItem('userInfo')?JSON .parse(localStorage.getItem('userInfo') as string) : null,
}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUserCredental:(state,action) => {
            state.userData = action.payload;
            localStorage.setItem('userInfo',JSON.stringify(action.payload));
        },
        userLogout:(state) => {
            state.userData = null;
            localStorage.removeItem('userInfo');
        }
        
    }
})

export const {
    setUserCredental,
    userLogout
} = authSlice.actions

export default authSlice.reducer;