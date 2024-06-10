import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import userDetails from "./reducer/userDetailsReducer";
import postReducer from "./reducer/postReducer";
import userListReducer from "./reducer/userListReducer";
import commentReducer from "./reducer/commentReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userDetails: userDetails,
    post: postReducer,
    userList: userListReducer,
    comments: commentReducer,
  },
});
