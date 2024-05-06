import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ErrorComponent from "../component/ErrorComponent";
import { validateForm } from "../utils/validationCheck";
import { useDispatch } from "react-redux";
import { saveUserData, signupUser } from "../redux/reducer/authReducer";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    picture: null,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    picture: null,
  });
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "You need to allow access to your media library to upload a photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setFormData({ ...formData, picture: result.assets[0].uri });
    }
  };

  const handleSignUp = async () => {
    const { isValid, errors } = validateForm(formData);
    if (isValid) {
      const userCredential=await dispatch(signupUser({email:formData.email,password:formData.password}))
      const userUID=userCredential?.payload?.user?.uid;
      if(true){
        const signupResponse=await dispatch(saveUserData({userUID,formData}))
        console.log(signupResponse);
      }
    } else {
      console.log("Errors");
      setErrors(errors);
    }
  };

  return (
    <View className="w-[90%] sm:w-[50%] lg:w-[35%] 2xl:w-[30%] mx-auto bg-white py-8 px-8 mt-10 rounded-lg shadow-lg">
      <View className="items-center mb-5 sm:mb-8">
        <Text className="text-3xl font-bold">Signup Form</Text>
      </View>
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(value) => handleChange("firstName", value)}
        />
        <ErrorComponent errorMessage={errors.firstName} />
      </View>
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(value) => handleChange("lastName", value)}
        />
        <ErrorComponent errorMessage={errors.lastName} />
      </View>
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
        />
        <ErrorComponent errorMessage={errors.email} />
      </View>
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={formData.phoneNumber}
          onChangeText={(value) => handleChange("phoneNumber", value)}
        />
        <ErrorComponent errorMessage={errors.phoneNumber} />
      </View>
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
          placeholder="Password"
          secureTextEntry={true}
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
        />
        <ErrorComponent errorMessage={errors.password} />
      </View>
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
        />
        <ErrorComponent errorMessage={errors.confirmPassword} />
      </View>
      <View className="mb-4">
        <TouchableOpacity
          className="bg-blue-500 rounded-md px-4 py-2 sm:py-3"
          onPress={handleImagePick}
        >
          <Text className="text-center text-white">Upload Photo</Text>
        </TouchableOpacity>
        <ErrorComponent errorMessage={errors.picture}/>
        {formData.picture && (
          <Image
            source={{ uri: formData.picture }}
            className="w-24 h-24 rounded-md mb-4"
          />
        )}
      </View>
      <TouchableOpacity
        className="bg-green-500 rounded-md px-4 py-2 sm:py-3"
        onPress={handleSignUp}
      >
        <Text className="text-center text-white">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpForm;
