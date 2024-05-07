import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import RegisterPage from "./src/pages/RegisterPage";
import { NativeWindStyleSheet } from "nativewind";
import "./src/styles.css";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomePage from "./src/pages/HomePage";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const Stack=createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown:false
        }}>
          <Stack.Screen name="signup"  component={RegisterPage}/>
          <Stack.Screen name="HomePage" component={HomePage}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
