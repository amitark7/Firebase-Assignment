import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import slugify from "slugify";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../redux/reducer/postReducer";
import { validatePostField } from "../utils/validationCheck";
import ConfirmationModal from "../component/ConfirmationModal";
import ErrorComponent from "../component/ErrorComponent";
import { getUserList } from "../redux/reducer/userDetailsReducer";
import UploadAndShowPicture from "../component/UploadAndShowPicture";

const AddPost = () => {
  const richText = useRef();
  DropDownPicker.setMode("BADGE");
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
  const [openDropDown, setOpenDropDown] = useState(false);
  const [galleryAndCameraImage, setGalleryAndCameraImage] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [dropDownUserList, setDropDownUserList] = useState([]);
  const { userDetails } = useSelector((state) => state.userDetails);
  const { userList } = useSelector((state) => state.userList);
  const { loading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const closeConfirmationModalAndClearFieldData = () => {
    setShowConfirmationModal(false);
    setNewPostData({
      title: "",
      description: "",
      slug: "",
      picture: "",
    });
    setTaggedUsers([]);
    setGalleryAndCameraImage("");
    richText.current.setContentHTML("");
  };

  const submitNewPost = async () => {
    const { isValid, errors } = validatePostField(newPostData);
    if (isValid) {
      await dispatch(
        addPost({
          ...newPostData,
          updatedBy: userDetails.uid,
          taggedUsers: taggedUsers,
        })
      );
      setShowConfirmationModal(true);
    } else {
      setErrors(errors);
    }
  };

  useEffect(() => {
    setDropDownUserList(
      userList.map((user) => {
        return {
          label: `${user.firstName} ${user.lastName}`,
          value: `${user.firstName} ${user.lastName}`,
        };
      })
    );
  }, [userList]);

  useEffect(() => {
    if (galleryAndCameraImage) {
      setNewPostData({ ...newPostData, picture: galleryAndCameraImage });
    }
  }, [galleryAndCameraImage]);

  useEffect(() => {
    dispatch(getUserList());
  }, []);

  return (
    <ScrollView className="bg-gray-300">
      <View className="flex-1 justify-center">
        <View className="w-full sm:w-[50%] lg:w-[35%] 2xl:w-[30%]  mx-auto py-4 px-4 mb-10 rounded-lg shadow-lg">
          <View className="mb-4">
            <TextInput
              className="border border-white bg-white rounded-md px-4 py-2 sm:py-3"
              placeholder="Enter Title"
              value={newPostData.title}
              onChangeText={(text) => {
                setNewPostData({
                  ...newPostData,
                  title: text,
                  slug: slugify(text, { lower: true }),
                });
                setErrors({ ...errors, title: "" });
              }}
            />
            <ErrorComponent errorMessage={errors.title} />
          </View>
          <View className="mb-4">
            <TextInput
              className="border border-white bg-white rounded-md px-4 py-2 sm:py-3"
              placeholder="Your Slug"
              value={newPostData.slug}
              editable={false}
            />
          </View>
          <View className="mb-4 h-[150px]">
            <RichEditor
              ref={richText}
              useContainer={false}
              onChange={(descriptionText) => {
                setNewPostData({
                  ...newPostData,
                  description: descriptionText,
                });
                setErrors({ ...errors, description: "" });
              }}
              placeholder="Description"
            />
            <RichToolbar editor={richText} />
            <ErrorComponent errorMessage={errors.description} />
          </View>
          <View>
            <UploadAndShowPicture
              galleryAndCameraImage={galleryAndCameraImage}
              setGalleryAndCameraImage={setGalleryAndCameraImage}
            />
            <ErrorComponent errorMessage={errors.picture} />
          </View>
          <View className="mt-1">
            <DropDownPicker
              open={openDropDown}
              value={taggedUsers}
              items={dropDownUserList}
              setOpen={setOpenDropDown}
              setValue={setTaggedUsers}
              searchable={true}
              placeholder="Search or choose a tag"
              showBadgeDot={true}
              multiple={true}
              dropDownDirection="TOP"
            />
          </View>
          <TouchableOpacity
            className={`p-3 w-[200px] mx-auto ${
              loading ? "bg-blue-300" : "bg-blue-500"
            } rounded-md mt-8`}
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
            onConfirm={closeConfirmationModalAndClearFieldData}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default AddPost;
