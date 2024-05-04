import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
export const signupUser=createAsyncThunk("auth/signupUser",async (data)=>{
    try {
        const response=await createUserWithEmailAndPassword(auth,data.email,data.password)
        return response;
    } catch (error) {
        return error.response
    }
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    loading: false,
  },
  reducers:{

  }
});

export default authSlice.reducer;
