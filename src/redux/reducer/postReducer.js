import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";
import { db, imageStorage } from "../../firebase/firebaseConfig";


export const addPost = createAsyncThunk("post/addPost", async (data) => {
    try {
        const slug = slugify(data.title, {
            lowercase: false,
        });
        // const timestamp = new Date().toISOString();
        const storageRef = ref(
            storage,
            `Posts/${data.user.updatedBy}/postphotos${timestamp}`
        );
        await uploadBytes(storageRef, data.photo);
        const downloadURL = await getDownloadURL(storageRef);
        const postData = {
            title: data.title,
            description: data.description,
            slug: slug,
            createdAt: timestamp,
            updatedAt: timestamp,
            updatedBy: data.user.updatedBy,
            photo: downloadURL,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            profilePhotoPath: data.user.profilePhotoPath,
            taggedUser: data.taggedUser,
        };
        try {
            await addDoc(collection(db, "Posts"), postData);
        } catch (error) {
            console.log("Unable to add new post", error);
        }
    } catch (error) {
        return error
    }
})
const postSlice = createSlice({
    name: "post",
    initialState: {
        loading: false
    },
    extraReducers: (builder) => {
        builder.addCase(addPost.pending, (state) => {
            state.loading = true
        })
            .addCase(addPost.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(addPost.rejected, (state) => {
                state.loading = false
            })
    }
})

export default postSlice.reducer;