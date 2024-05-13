import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "../redux/reducer/authReducer";
import {
  getUserDetails,
  updateUserDetails,
} from "../redux/reducer/userDetailsReducer";
import { FontAwesome5 } from "@expo/vector-icons";
import { handleImagePicker } from "../utils/handleImagePicker";
import ErrorComponent from "../component/ErrorComponent";
import { validateForm } from "../utils/validationCheck";
import ConfirmationModal from "../component/ConfirmationModal";

const UpdateUserDetails = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const { userDetails, loading } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    picture: "",
  });

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    picture: "",
  });

  const handleChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
    setErrors({ ...errors, [field]: "" });
  };

  const handleImageSelect = async () => {
    const imageURL = (await handleImagePicker()) || null;
    setUserData({ ...userData, picture: imageURL });
  };

  const setUserDetails = async () => {
    try {
      const result = await dispatch(getUserDetails(user?.uid));
      if (result?.payload) {
        setUserData({
          ...userData,
          lastName: result?.payload?.lastName,
          firstName: result?.payload?.firstName,
          email: result?.payload?.email,
          phoneNumber: result?.payload?.phoneNumber,
          picture: result?.payload?.picture,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateClick = async () => {
    const { isValid, errors } = validateForm(userData);
    console.log(isValid, errors);
    if (isValid) {
      await dispatch(updateUserDetails({ data: userData, id: userDetails.id }));
      setShowConfirmationModal(true);
    } else {
      setErrors(errors);
    }
  };

  const handleNavigate = () => {
    navigation.navigate("AllPostPage");
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    setUserDetails();
  }, [user]);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, []);

  return (
    <ScrollView>
      <View className="w-[90%] sm:w-[50%] md:w-[35%] lg:w-[30%] bg-white rounded-lg mx-auto flex-1 justify-center p-10 mt-10">
        <Text className="text-2xl font-bold text-center mb-4">User Details</Text>
        <View className="mb-4">
          <TextInput
            className="border border-gray-400 p-2 rounded-lg"
            placeholder="Enter First Name"
            value={userData.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
          />
          <ErrorComponent errorMessage={errors.firstName} />
        </View>
        <View className="mb-4">
          <TextInput
            className="border border-gray-400 p-2 rounded-lg"
            placeholder="Enter Last Name"
            value={userData.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
          />
          <ErrorComponent errorMessage={errors.lastName} />
        </View>
        <View className="mb-4">
          <TextInput
            className="border border-gray-400 p-2 rounded-lg"
            placeholder="Enter Email"
            value={userData.email}
            onChangeText={(text) => handleChange("email", text)}
            editable={false}
          />
          <ErrorComponent errorMessage={errors.email} />
        </View>
        <View className="mb-4">
          <TextInput
            className="border border-gray-400 p-2 rounded-lg"
            placeholder="Enter Phone Number"
            value={userData.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
          />
          <ErrorComponent errorMessage={errors.phoneNumber} />
        </View>
        <View className="mb-4">
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
          <ErrorComponent errorMessage={errors.picture} />
          {userData.picture && (
            <Image
              source={{ uri: userData.picture }}
              className="w-24 h-24 rounded-md mb-1 mt-1"
            />
          )}
        </View>
        <TouchableOpacity
          className={`p-3 ${
            loading ? "bg-gray-200" : "bg-blue-500"
          } rounded-lg`}
          onPress={onUpdateClick}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-center text-white">Update</Text>
          )}
        </TouchableOpacity>
      </View>
      {showConfirmationModal && (
        <ConfirmationModal
          modalTitle={"Succesfully"}
          modalSubTitle={"User updated succesfully"}
          visible={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleNavigate}
          btnOkText={"Ok"}
        />
      )}
    </ScrollView>
  );
};

export default UpdateUserDetails;
