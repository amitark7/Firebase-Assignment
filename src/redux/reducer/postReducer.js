import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import slugify from "slugify";
import { addDoc, collection } from "firebase/firestore";
import { db, imageStorage } from "../../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";

export const addPost = createAsyncThunk("post/addPost", async (data) => {
  try {
    const timestamp = new Date().toISOString();
    const slug = slugify(data.title, {
      lower: true,
    });

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
      slug: slug,
      createdAt: timestamp,
      updatedAt: timestamp,
      picture: imageURL,
    };
    await addDoc(collection(db, "Posts"), postData);
  } catch (error) {
    return error;
  }
});
const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: false,
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
      });
  },
});

export default postSlice.reducer;
