import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AllPostPage from "./AllPostPage";
import AddPost from "./AddPost";
import { FontAwesome5 } from "@expo/vector-icons";
import UserRegisterAndUpdate from "./UserRegisterAndUpdate";

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="AllPostPage"
        component={AllPostPage}
        options={{
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
