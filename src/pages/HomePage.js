import { ScrollView, StatusBar, Text } from "react-native";
import React from "react";
import { auth } from "../firebase/firebaseConfig";
import { TouchableOpacity } from "react-native";

const HomePage = ({navigation}) => {
  const logout=async ()=>{
    await auth.signOut()
    navigation.replace("LoginPage")
  }
  return (
    <ScrollView>
      <StatusBar />
      <Text>This is Home Page</Text>
      <TouchableOpacity onPress={logout} className="p-3 w-[100px] mx-auto bg-red-400 rounded-lg">
        <Text className="text-center">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomePage;
