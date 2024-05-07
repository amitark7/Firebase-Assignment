import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, imageStorage } from "../../firebase/firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

      const userDocRef = await addDoc(collection(db, "users"), userData);
      return userDocRef;
    } catch (error) {
      return error.response;
    }
  }
);

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
      });
  },
});

export default authSlice.reducer;
