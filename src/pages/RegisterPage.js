import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import { saveUserData, signupUser } from "../redux/reducer/authReducer";
import { validateForm } from "../utils/validationCheck";
import { handleImagePicker } from "../utils/handleImagePicker";
import ConfirmationModal from "../component/ConfirmationModal";
import ErrorComponent from "../component/ErrorComponent";
import CameraModal from "../component/CameraModal";

const RegisterPage = ({ navigation }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    picture: "",
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
  const loading = useSelector((state) => state.auth.loading);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageSelect = async () => {
    const imageURL = (await handleImagePicker()) || null;
    setFormData({ ...formData, picture: imageURL });
  };

  const handleSignUp = async () => {
    const { isValid, errors } = validateForm(formData);
    if (isValid) {
      const userCredential = await dispatch(
        signupUser({ email: formData.email, password: formData.password })
      );
      if (userCredential?.payload?.code) {
        setErrors({ ...errors, email: "Email already registered" });
        return;
      }
      const userUID = userCredential?.payload?.user?.uid;
      if (userUID) {
        await dispatch(saveUserData({ userUID, formData }));
        setShowConfirmationModal(true);
      }
    } else {
      setErrors(errors);
    }
  };

  const handleNavigate = () => {
    navigation.replace("HomePage");
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    if (image) {
      setFormData({ ...formData, picture: image });
    }
  }, [image]);

  return (
    <ScrollView contentContainerStyle={{ justifyContent: "center" }}>
      <View className="flex-1 items-center justify-center mt-20">
        <View className="w-[90%] sm:w-[50%] lg:w-[35%] 2xl:w-[30%] mx-auto bg-white py-8 px-8 mb-10 rounded-lg shadow-lg">
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
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
            />
            <ErrorComponent errorMessage={errors.password} />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-2"
            >
              <FontAwesome5
                name={showPassword ? "eye-slash" : "eye"}
                size={18}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View className="mb-4">
            <TextInput
              className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
            />
            <ErrorComponent errorMessage={errors.confirmPassword} />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-3 right-2"
            >
              <FontAwesome5
                name={showConfirmPassword ? "eye-slash" : "eye"}
                size={18}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View className="mb-4">
            <View className="flex flex-row justify-between items-center">
              <TouchableOpacity
                className="bg-blue-500 rounded-md px-4 py-2 sm:py-3"
                onPress={handleImageSelect}
              >
                <FontAwesome5
                  name="image"
                  size={28}
                  color="#fff"
                  className="text-center"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowCamera(true)}
                className="bg-blue-500 rounded-md px-4 py-2 sm:py-3"
              >
                <FontAwesome5 name="camera" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <ErrorComponent errorMessage={errors.picture} />
            {formData.picture && (
              <Image
                source={{ uri: formData.picture }}
                className="w-24 h-24 rounded-md mb-1 mt-1"
              />
            )}
          </View>
          <TouchableOpacity
            className={`${
              loading ? "bg-gray-200" : "bg-green-500"
            } rounded-md px-4 py-2 sm:py-3 text-center`}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white">Signup</Text>
            )}
          </TouchableOpacity>
          {showConfirmationModal && (
            <ConfirmationModal
              modalTitle={"Succesfully"}
              modalSubTitle={
                "User registered succesfully. click ok to HomePage"
              }
              visible={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
              onConfirm={handleNavigate}
              btnOkText={"Ok"}
            />
          )}
          {showCamera && (
            <CameraModal setShowCamera={setShowCamera} setImage={setImage} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterPage;
