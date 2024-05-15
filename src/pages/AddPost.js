import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useDispatch, useSelector } from "react-redux";
import { handleImagePicker } from "../utils/handleImagePicker";
import { addPost } from "../redux/reducer/postReducer";
import { validatePostField } from "../utils/validationCheck";
import ConfirmationModal from "../component/ConfirmationModal";
import ErrorComponent from "../component/ErrorComponent";

const AddPost = ({ navigation }) => {
  const richText = useRef();
  const [newPostData, setNewPostData] = useState({
    title: "",
    description: "",
    picture: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    picture: "",
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { userDetails } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const handleImageSelect = async () => {
    const imageURL = await handleImagePicker();
    setNewPostData({ ...newPostData, picture: imageURL });
    imageURL && setErrors({ ...errors, picture: "" });
  };

  const closeModalAndClearFieldData = () => {
    setShowConfirmationModal(false);
    setNewPostData({
      title: "",
      description: "",
      picture: null,
    });
    richText.current.setContentHTML("");
  };

  const submitNewPost = async () => {
    const { isValid, errors } = validatePostField(newPostData);
    if (isValid) {
      await dispatch(addPost({ ...newPostData, updatedBy: userDetails.uid }));
      setShowConfirmationModal(true);
    } else {
      setErrors(errors);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View className="flex-1 justify-center">
        <View className="w-[90%] sm:w-[50%] lg:w-[35%] 2xl:w-[30%] bg-gray-300 mx-auto py-8 px-8 mb-10 rounded-lg shadow-lg">
          <Text className="text-center text-2xl font-bold mb-2">Add Post</Text>
          <View className="mb-2">
            <TextInput
              className="border border-white bg-white rounded-md px-4 py-2 sm:py-3"
              placeholder="Enter title"
              value={newPostData.title}
              onChangeText={(text) => {
                setNewPostData({ ...newPostData, title: text });
                setErrors({ ...errors, title: "" });
              }}
            />
            <ErrorComponent errorMessage={errors.title} />
          </View>
          <View className="mb-2">
            <TouchableOpacity
              className="py-3 px-4 bg-blue-500 rounded-md"
              onPress={handleImageSelect}
            >
              <Text className="text-center text-white">Select Image</Text>
            </TouchableOpacity>
            <ErrorComponent errorMessage={errors.picture} />
          </View>
          <RichEditor
            ref={richText}
            onChange={(descriptionText) => {
              setNewPostData({ ...newPostData, description: descriptionText });
              setErrors({ ...errors, description: "" });
            }}
          />
          <RichToolbar editor={richText} />
          <ErrorComponent errorMessage={errors.description} />
          {newPostData.picture && (
            <Image
              source={{ uri: newPostData.picture }}
              className="h-[100px] w-[100px] mt-2"
            />
          )}
          <TouchableOpacity
            className={`p-3 ${
              loading ? "bg-blue-300" : "bg-blue-500"
            } rounded-md mt-4`}
            onPress={submitNewPost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={"#fff"} />
            ) : (
              <Text className="text-center text-white">Add Post</Text>
            )}
          </TouchableOpacity>
        </View>
        {showConfirmationModal && (
          <ConfirmationModal
            btnOkText={"Ok"}
            modalTitle={"Succesfully"}
            modalSubTitle={"Post Added Successfully"}
            onConfirm={closeModalAndClearFieldData}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default AddPost;
