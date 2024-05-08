import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { NativeWindStyleSheet } from "nativewind";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import UserRegisterPage from "./src/pages/UserRegisterPage";
import HomePage from "./src/pages/HomePage";
import LoginPage from "./src/pages/LoginPage";
import "./src/styles.css";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="UserRegisterPage" component={UserRegisterPage} />
          <Stack.Screen name="HomePage" component={HomePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
