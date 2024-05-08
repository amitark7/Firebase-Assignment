import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator } from "react-native";
import { validateForm } from "../utils/validationCheck";
import { userLogin } from "../redux/reducer/authReducer";
import ErrorComponent from "../component/ErrorComponent";

const LoginPage = ({ navigation }) => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleInputChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const onLoginSubmit = async () => {
    const { isValid, errors } = validateForm(userData, true);
    if (isValid) {
      const result = await dispatch(userLogin(userData));
      if (result.payload?.code === "auth/invalid-credential") {
        setErrors({ ...errors, authError: "Email or Password is incorrect" });
      } else {
        navigation.replace("HomePage");
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <View className="flex-1 flex-col items-center justify-center">
      <View className="border bg-white w-[90%] sm:w-1/2 md:w-2/5 xl:w-1/3 2xl:w-1/4 py-10 px-5 text-center border-gray-200 rounded-lg mx-auto mt-20 shadow-lg">
        <Text className="text-3xl font-semibold mb-6 text-center">Login</Text>
        <View className="w-full mb-6">
          <TextInput
            className={`w-full rounded-md py-3 pl-2 outline-none border-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Email ID"
            value={userData.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
          {/* {errors.email && <Text className="text-red-500">{errors.email}</Text>} */}
          <ErrorComponent errorMessage={errors.email} />
        </View>
        <View className="w-full mb-6">
          <TextInput
            className={`w-full rounded-md py-3 pl-2 outline-none border-2 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password"
            secureTextEntry={true}
            value={userData.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          <ErrorComponent errorMessage={errors.password} />
          <ErrorComponent errorMessage={errors.authError} />
        </View>
        <TouchableOpacity
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } py-2 text-xl rounded-md mb-4 font-semibold`}
          onPress={onLoginSubmit}
          disabled={loading}
        >
          <Text className="text-white text-center">
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text>Login</Text>
            )}
          </Text>
        </TouchableOpacity>
        <Text className="text-base text-center">
          Don't have an account?{" "}
          <Text
            className="text-blue-500"
            onPress={() => navigation.navigate("UserRegisterPage")}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;
