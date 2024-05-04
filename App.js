import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import RegisterPage from "./src/pages/RegisterPage";
import { NativeWindStyleSheet } from "nativewind";
import "./src/styles.css";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <Provider store={store}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="bg-gray-200 flex items-center justify-center flex-1 mt-5">
          <StatusBar backgroundColor="#61dafb" />
          <RegisterPage />
        </View>
      </ScrollView>
    </Provider>
  );
}
