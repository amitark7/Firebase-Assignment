import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { createRef, useState } from "react";
import { handleImagePicker } from "../utils/handleImagePicker";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../redux/reducer/postReducer";

const AddPost = () => {
  const richText = createRef();
  const [newPostData, setNewPostData] = useState({ title: "", description: "", picture: null })
  const { userDetails } = useSelector((state) => state.userDetails)
  const dispatch = useDispatch()

  const handleImageSelect = async () => {
    const imageURL = await handleImagePicker();
    setNewPostData({ ...newPostData, picture: imageURL });
  };

  const handleSubmitNewPost = () => {
    if (newPostData.picture) {
      dispatch(
        addPost({
          title: newPostData.title,
          photo: newPostData.picture,
          description: newPostData.description,
          user: {
            firstName: userDetails?.firstName,
            lastName: userDetails?.lastName,
            updatedBy: userDetails?.uid,
            picture: userDetails?.picture,
          },
        })
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View className="flex-1 justify-center">
        <View className="w-[90%] sm:w-[50%] lg:w-[35%] 2xl:w-[30%] bg-gray-300 mx-auto py-8 px-8 mb-10 rounded-lg shadow-lg">
          <Text className="text-center text-2xl font-bold mb-2">Add Post</Text>
          <TextInput
            className="border border-white bg-white rounded-md mb-2 px-4 py-2 sm:py-3"
            placeholder="Enter title"
            value={title}
            onChangeText={(text) => setNewPostData({ ...newPostData, title: text })}
          />
          <TouchableOpacity
            className="py-3 px-4 bg-blue-500 rounded-md mb-2"
            onPress={handleImageSelect}
          >
            <Text className="text-center text-white">Select Image</Text>
          </TouchableOpacity>
          <RichEditor
            ref={richText}
            onChange={(descriptionText) => {
              setNewPostData({ ...newPostData, description: descriptionText });
            }}
          />
          <RichToolbar
            editor={richText}
          />
          {newPostData.picture && (
            <Image source={{ uri: newPostData.picture }} className="h-[100px] w-[100px] mt-2" />
          )}
          <TouchableOpacity
            className="p-3 bg-blue-500 rounded-md mt-4"
            onPress={handleSubmitNewPost}
          >
            <Text className="text-center text-white">Add Post</Text>
          </TouchableOpacity>
          <View>
            <Text>{`${description}`}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddPost;
