import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (data) => {
    try {
      const response = await addDoc(collection(db, "comments"), data);
      return response._key.path.segments[1];
    } catch (error) {
      return error;
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (data) => {
    try {
      const commentDoc = doc(db, "comments", data.id);
      await updateDoc(commentDoc, data);
    } catch (error) {
      return error;
    }
  }
);
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id) => {
    const commentDoc = doc(db, "comments", id);
    try {
      await deleteDoc(commentDoc);
    } catch (error) {
      return error;
    }
  }
);

export const getComments = createAsyncThunk("comments/getComment", async () => {
  try {
    const data = await getDocs(collection(db, "comments"));
    let comments = [];
    data.forEach((doc) => {
      comments = [...comments, { ...doc.data(), id: doc.id }];
    });
    return comments;
  } catch (error) {
    return error;
  }
});

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
        state.comments = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateComment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default commentSlice.reducer;
