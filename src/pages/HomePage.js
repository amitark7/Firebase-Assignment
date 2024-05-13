import { SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import React from "react";
import { auth } from "../firebase/firebaseConfig";
import { TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UpdateUserDetails from "./UpdateUserDetails";
import AllPostPage from "./AllPostPage";
import AddPost from "./AddPost";

const HomePage = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="AllPostPage" component={AllPostPage} />
      <Drawer.Screen name="UpdateUserDetails" component={UpdateUserDetails} />
      <Drawer.Screen name="AddPost" component={AddPost} />
    </Drawer.Navigator>
  );
};

export default HomePage;
