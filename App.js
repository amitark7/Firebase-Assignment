import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from "./src/pages/DrawerNavigation";
import { useEffect, useState } from "react";
import { NativeWindStyleSheet } from "nativewind";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import UserRegisterAndUpdate from "./src/pages/UserRegisterAndUpdate";
import LoginPage from "./src/pages/LoginPage";
import { auth } from "./src/firebase/firebaseConfig";
import "./src/styles.css";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen
            name="UserRegisterPage"
            component={UserRegisterAndUpdate}
          />
          <Stack.Screen name="HomePage" component={DrawerNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
