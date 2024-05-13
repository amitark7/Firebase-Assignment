import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UpdateUserDetails from "./UpdateUserDetails";
import AllPostPage from "./AllPostPage";
import AddPost from "./AddPost";
import { FontAwesome5 } from "@expo/vector-icons";

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
    <Drawer.Screen 
      name="AllPostPage" 
      component={AllPostPage} 
      options={{
        drawerLabel: 'All Post',
        drawerIcon: ({ color, size }) => (
          <FontAwesome5 name="list" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="UpdateUserDetails" 
      component={UpdateUserDetails} 
      options={{
        drawerLabel: 'Update User',
        drawerIcon: ({ color, size }) => (
          <FontAwesome5 name="user" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="AddPost" 
      component={AddPost} 
      options={{
        drawerLabel: 'Add Post',
        drawerIcon: ({ color, size }) => (
          <FontAwesome5 name="plus" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
  );
};

export default DrawerNavigation;
