import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { auth, db, imageStorage } from "../../firebase/firebaseConfig";

export const signupUser = createAsyncThunk("auth/signupUser", async (data) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return response;
  } catch (error) {
    return error;
  }
});

export const saveUserData = createAsyncThunk(
  "auth/saveUserData",
  async (data) => {
    try {
      const imageRef = ref(imageStorage, "images/" + Date.now());
      let imageURL = null;
      if (data.formData.picture) {
        await uploadBytes(imageRef, data.formData.picture);
        imageURL = await getDownloadURL(imageRef);
      }

      const userData = {
        firstName: data?.formData.firstName,
        lastName: data?.formData.lastName,
        phoneNumber: data?.formData.phoneNumber,
        picture: imageURL,
        email: data?.formData.email,
        uid: data.userUID,
      };

      await addDoc(collection(db, "users"), userData);
    } catch (error) {
      return error.response;
    }
  }
);

export const saveSocialAuthData = createAsyncThunk(
  "auth/socialAuthData",
  async (data) => {
    try {
      const userData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        phoneNumber: data?.phoneNumber || null,
        picture: data?.pictureUrl,
        email: data?.email,
        uid: data.userUID,
      };

      const response = await addDoc(collection(db, "users"), userData);
      return response;
    } catch (error) {
      return error;
    }
  }
);
export const userLogin = createAsyncThunk("auth/userLogin", async (data) => {
  try {
    const response = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return response.user;
  } catch (error) {
    return error;
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveUserData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveUserData.rejected, (state) => {
        state.loading = false;
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
