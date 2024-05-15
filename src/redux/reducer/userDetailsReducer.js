import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const getUserDetails = createAsyncThunk(
  "userDetails/getUserDetails",
  async (uid) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", `${uid}`));
      const data = await getDocs(q);
      return { ...data?.docs[0]?.data(), id: data?.docs[0]?.id };
    } catch (error) {
      return error;
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "userDetails/updateUser",
  async (userData) => {
    const userDoc = doc(db, "users", userData.id);
    await updateDoc(userDoc, userData.data);
  }
);

export const getUserList = createAsyncThunk("user/getUserList", async () => {
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
});

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    userDetails: {},
    userList: [],
    isLoading: false,
    isSuccess: false,
  },
  reducers: {
    resetUserDetails: (state) => {
      state.userDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.isSuccess = true;
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.isSuccess = true;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.isSuccess = false;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userList = action.payload;
      });
  },
});

export const { resetUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
