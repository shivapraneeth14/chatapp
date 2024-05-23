import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        username: ""
    },
    name:"request",
    initialState:{
        status:false
    },
    reducers: {
        addUsername: (state, action) => {
            state.username = action.payload;
        },
        setstatus:(state,action)=>{
            state.status = action.payload
        }
    }
});

export const { addUsername,setstatus } = userSlice.actions;
export const Userreducer = userSlice.reducer