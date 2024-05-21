import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
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
      const data = await getDocs(collection(db, "comments"));
      let comments = [];
      data.forEach((doc) => {
        comments = [...comments, { ...doc.data(), id: doc.id }];
      });
      console.log("CommentList", comments);
      return comments;
    } catch (error) {
      return error
    }
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
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })
  },
});

export default commentSlice.reducer;
