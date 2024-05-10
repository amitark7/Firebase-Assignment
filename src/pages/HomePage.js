import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { auth } from "../firebase/firebaseConfig";
import { TouchableOpacity } from "react-native-web";

const HomePage = () => {
  const logout=()=>{
    auth.signOut()
  }
  return (
    <ScrollView>
      <StatusBar />
      <Text>This is Home Page</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomePage;
