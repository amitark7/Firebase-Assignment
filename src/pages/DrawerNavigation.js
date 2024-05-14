import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AllPostPage from "./AllPostPage";
import AddPost from "./AddPost";
import { FontAwesome5 } from "@expo/vector-icons";
import UserRegisterAndUpdate from "./UserRegisterAndUpdate";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "../redux/reducer/authReducer";
import { getUserDetails } from "../redux/reducer/userDetailsReducer";

const DrawerNavigation = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user?.uid) {
      dispatch(getUserDetails(user?.uid));
    }
  }, [user]);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, []);
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="AllPostPage"
        component={AllPostPage}
        options={{
          title: "All Post",
          drawerLabel: "All Post",
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="list" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UpdateUserDetails"
        component={UserRegisterAndUpdate}
        options={{
          title: "Update User",
          drawerLabel: "Update User",
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AddPost"
        component={AddPost}
        options={{
          title: "Add Post",
          drawerLabel: "Add Post",
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="plus" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
