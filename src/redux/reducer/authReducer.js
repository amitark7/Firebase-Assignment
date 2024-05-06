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
    console.log(error.response);
    return error.response;
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

      // Add user data to Firestore
      const userData = {
        firstName: data?.formData.firstName,
        lastName: data?.formData.lastName,
        phoneNumber: data?.formData.phoneNumber,
        picture: imageURL,
        email: data?.formData.email,
        uid: data.userUID,
      };

      const userDocRef = await addDoc(collection(db, "users"), userData);
      console.log("Document written with ID: ", userDocRef);

      return userDocRef; // Return the DocumentReference for additional operations
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
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
});

export default authSlice.reducer;
