import { Text, View } from "react-native";
import React from "react";
import { auth } from "../firebase/firebaseConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { resetUserDetails } from "../redux/reducer/userDetailsReducer";

const AllPostPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const logout = async () => {
    await auth.signOut();
    dispatch(resetUserDetails());
    navigation.replace("LoginPage");
  };
  return (
    <View>
      <Text>This is All Post Page</Text>
      <TouchableOpacity
        onPress={logout}
        className="p-2 bg-blue-300 w-[120px] rounded-lg mt-2 mx-auto"
      >
        <Text className="text-center text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AllPostPage;
