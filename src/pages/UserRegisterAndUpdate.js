import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import { handleImagePicker } from "../utils/handleImagePicker";
import { saveUserData, signupUser } from "../redux/reducer/authReducer";
import { validateForm } from "../utils/validationCheck";
import ConfirmationModal from "../component/ConfirmationModal";
import ErrorComponent from "../component/ErrorComponent";
import CameraModal from "../component/CameraModal";
import { updateUserDetails } from "../redux/reducer/userDetailsReducer";

const UserRegisterAndUpdate = ({ navigation }) => {
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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { userDetails, isLoading } = useSelector((state) => state.userDetails);
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageSelect = async () => {
    const imageURL = (await handleImagePicker()) || null;
    setFormData({ ...formData, picture: imageURL });
  };

  const onSubmit = async () => {
    const { isValid, errors } = validateForm(
      formData,
      false,
      userDetails.id ? true : false
    );
    if (isValid) {
      if (userDetails.id) {
        await dispatch(
          updateUserDetails({ data: formData, id: userDetails.id })
        );
        setShowConfirmationModal(true);
      } else {
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
      }
    } else {
      setErrors(errors);
    }
  };

  const handleNavigate = () => {
    if (!userDetails.id) {
      navigation.replace("HomePage");
    } else {
      navigation.navigate("HomePage");
    }
    resetField();
    setShowConfirmationModal(false);
  };

  const resetField = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      picture: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      picture: null,
    });
    setImage(null);
  };

  useEffect(() => {
    if (userDetails.id) {
      setFormData({
        ...formData,
        lastName: userDetails?.lastName,
        firstName: userDetails?.firstName,
        email: userDetails?.email,
        phoneNumber: userDetails?.phoneNumber,
        picture: userDetails?.picture,
      });
    }
  }, []);

  useEffect(() => {
    if (image) {
      setFormData({ ...formData, picture: image });
    }
  }, [image]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="flex-1 items-center justify-center mt-20">
          <View className="w-[90%] sm:w-[50%] lg:w-[35%] 2xl:w-[30%] mx-auto bg-white py-8 px-8 mb-10 rounded-lg shadow-lg">
            <View className="items-center mb-5 sm:mb-8">
              <Text className="text-3xl font-bold">
                {userDetails.id ? "User Details" : "Signup"}
              </Text>
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
                editable={userDetails.id ? false : true}
                onChangeText={(value) => handleChange("email", value)}
                autoCapitalize="none"
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
            {!userDetails.id && (
              <>
                <View className="mb-4">
                  <TextInput
                    className="border border-gray-300 rounded-md px-4 py-2 sm:py-3"
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(value) => handleChange("password", value)}
                    autoCapitalize="none"
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
                    onChangeText={(value) =>
                      handleChange("confirmPassword", value)
                    }
                    autoCapitalize="none"
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
              </>
            )}
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
                loading || isLoading ? "bg-gray-200" : "bg-green-500"
              } rounded-md px-4 py-2 sm:py-3 text-center`}
              onPress={onSubmit}
              disabled={loading || isLoading}
            >
              {loading || isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-center text-white">
                  {userDetails.id ? "Update" : "Signup"}
                </Text>
              )}
            </TouchableOpacity>
            {showConfirmationModal && (
              <ConfirmationModal
                modalTitle={"Succesfully"}
                modalSubTitle={
                  userDetails.id
                    ? "User updated successfully"
                    : "User registered succesfully. click ok to HomePage"
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
        {!userDetails.id && (
          <TouchableOpacity
            className="absolute left-2 top-5 px-3 py-2"
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="chevron-left" size={22} color="#000" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserRegisterAndUpdate;
