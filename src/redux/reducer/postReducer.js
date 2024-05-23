import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, imageStorage } from "../../firebase/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "@firebase/storage";

export const addPost = createAsyncThunk(
  "post/addPost",
  async (data, { getState }) => {
    try {
      const { postList } = getState().post;
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
      const result = await addDoc(collection(db, "Posts"), postData);
      const updatedPostList = [
        { ...postData, id: result._key.path.segments[1] },
        ...postList,
      ];
      return updatedPostList;
    } catch (error) {
      return error;
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post, { getState }) => {
    try {
      const { postList } = getState().post;
      const postDoc = doc(db, "Posts", post.id);
      await deleteDoc(postDoc);

      const commentQuery = query(
        collection(db, "comments"),
        where("postId", "==", post.id)
      );
      const commentSnapshot = await getDocs(commentQuery);
      const deleteCommentPromises = commentSnapshot?.docs?.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await Promise.all(deleteCommentPromises);

      const pictureRef = ref(imageStorage, post.picture);
      await deleteObject(pictureRef);

      const updatedPostList = postList.filter((item) => item.id !== post.id);
      return updatedPostList;
    } catch (error) {
      return error;
    }
  }
);

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
              (commentId) => commentId !== data.commentId
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
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.postList = action.payload;
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
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.postList = action.payload;
      });
  },
});

export default postSlice.reducer;
