import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import userDetails from "./reducer/userDetailsReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userDetails:userDetails
  },
});
