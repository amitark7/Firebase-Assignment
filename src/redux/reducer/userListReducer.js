import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const getUserList = createAsyncThunk(
  "userList/getUserList",
  async () => {
    try {
      const data = await getDocs(collection(db, "users"));
      let users = [];
      data.forEach((doc) => {
        users = [...users, doc.data()];
      });
      return users;
    } catch (error) {
      return error;
    }
  }
);

const userListSlice = createSlice({
  name: "userList",
  initialState: {
    userList: [],
  },
  extraReducers: (builder) => {
    builder.addCase(getUserList.fulfilled, (state, action) => {
      state.userList = action.payload;
    });
  },
});

export default userListSlice.reducer;
