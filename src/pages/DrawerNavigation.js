import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import UserRegisterAndUpdate from "./UserRegisterAndUpdate";
import { getLoggedInUser } from "../redux/reducer/authReducer";
import {
  getUserDetails,
  resetUserDetails,
} from "../redux/reducer/userDetailsReducer";
import { auth } from "../firebase/firebaseConfig";
import AllPostPage from "./AllPostPage";
import AddPost from "./AddPost";

const DrawerNavigation = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { userDetails } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  const logout = async () => {
    await auth.signOut();
    dispatch(resetUserDetails());
    navigation.replace("LoginPage");
  };

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
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <SafeAreaView className="flex-1 ">
            <View className="justify-center items-center p-3">
              {userDetails.picture && (
                <Image
                  source={{ uri: userDetails.picture }}
                  className="h-[100px] w-[100px] rounded-full"
                />
              )}
              <Text className="text-2xl mt-2">{`${userDetails.firstName} ${userDetails.lastName}`}</Text>
            </View>
            <View className="flex-1">
              <DrawerItemList {...props} />
            </View>
            <View className="border-t border-gray-400">
              <TouchableOpacity className="py-4" onPress={logout}>
                <View className="flex-row items-center ml-5 mb-2">
                  <FontAwesome5 name="sign-out-alt" size={22} />
                  <Text className="text-base ml-4">Sign Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      }}
    >
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
      <Drawer.Screen
        name="Update Post"
        component={AddPost}
        options={{ drawerLabel: () => null }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
