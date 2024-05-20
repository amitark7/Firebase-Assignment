import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (data) => {
    try {
      console.log(data);
      await addDoc(collection(db, "comments"), data);
    } catch (error) {
      return error;
    }
  }
);

export const getComments = createAsyncThunk(
  "comments/getComment",
  async (data) => {
    try {
      console.log("Hey", data);
    } catch (error) {}
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: { loading: false, comments: [] },
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addComment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default commentSlice.reducer;
