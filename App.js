import 'expo-dev-client'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { NativeWindStyleSheet } from "nativewind";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import UserRegisterPage from "./src/pages/UserRegisterPage";
import HomePage from "./src/pages/HomePage";
import LoginPage from "./src/pages/LoginPage";
import { auth } from "./src/firebase/firebaseConfig";
import "./src/styles.css";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const Stack = createNativeStackNavigator();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe
  }, [user]);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {
            user ?
              <Stack.Screen name="HomePage" component={HomePage} /> :
              <>
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen
                  name="UserRegisterPage"
                  component={UserRegisterPage}
                />
              </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
