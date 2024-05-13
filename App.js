import 'react-native-gesture-handler';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { NativeWindStyleSheet } from "nativewind";
import { StatusBar } from 'react-native';
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import UserRegisterPage from "./src/pages/UserRegisterPage";
import LoginPage from "./src/pages/LoginPage";
import { auth } from "./src/firebase/firebaseConfig";
import DrawerNavigation from './src/pages/DrawerNavigation';
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
      <StatusBar/>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {
            user ?
              <Stack.Screen name="HomePage" component={DrawerNavigation} /> :
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
