import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, imageStorage } from "../../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";

export const addPost = createAsyncThunk("post/addPost", async (data) => {
  try {
    const timestamp = new Date().toISOString();

    const response = await fetch(data.picture);
    const blob = await response.blob();
    const imageRef = ref(
      imageStorage,
      `Posts/${data.updatedBy}/post/${new Date()}"`
    );
    await uploadBytes(imageRef, blob);
    const imageURL = await getDownloadURL(imageRef);

    const postData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      picture: imageURL,
    };
    await addDoc(collection(db, "Posts"), postData);
  } catch (error) {
    return error;
  }
});

export const getPostList = createAsyncThunk("post/getPostList", async () => {
  try {
    const data = await getDocs(collection(db, "Posts"));
    let posts = [];
    data.forEach((doc) => {
      posts = [...posts, { ...doc.data(), id: doc.id }];
    });
    return posts;
  } catch (error) {
    return error;
  }
});

export const addAndDeleteCommentIdInPost = createAsyncThunk(
  "post/addAndDeleteCommentIdInPost",
  async (data, { getState }) => {
    try {
      const { postList } = getState().post;

      const updatedPostList = postList.map((post) => {
        if (post.id === data.post.id) {
          let updatedComments = [];
          if (data?.isDelete) {
            updatedComments = post.comments.filter(
              (commentId) => commentId!== data.commentId
            );
            return { ...post, comments: updatedComments };
          }
          updatedComments = post.comments
            ? [...post.comments, data.commentId]
            : [data.commentId];
          return { ...post, comments: updatedComments };
        }
        return post;
      });

      const postDoc = doc(db, "Posts", data.post.id);
      await updateDoc(postDoc, {
        ...data.post,
        comments: updatedPostList.find((post) => post.id === data.post.id)
          .comments,
      });

      return updatedPostList;
    } catch (error) {
      return error;
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: false,
    postList: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addPost.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getPostList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
        state.loading = false;
      })
      .addCase(getPostList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addAndDeleteCommentIdInPost.fulfilled, (state, action) => {
        state.postList = action.payload;
      });
  },
});

export default postSlice.reducer;
