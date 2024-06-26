import { Image, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { handleImagePicker } from "../utils/handleImagePicker";
import CameraModal from "./CameraModal";

const UploadAndShowPicture = ({
  imageFromGalleryAndCamera,
  setImageFromGalleryAndCamera,
}) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleImageSelect = async () => {
    const imageURL = await handleImagePicker();
    imageURL && setImageFromGalleryAndCamera(imageURL);
  };

  return (
    <View className="mb-2 h-[120px] flex justify-center items-center bg-white border-gray-200 border rounded-lg">
      {imageFromGalleryAndCamera ? (
        <View className="relative w-[50%] mx-auto">
          <Image
            source={{ uri: imageFromGalleryAndCamera }}
            className=" h-[90px] w-full mt-2"
          />
          <TouchableOpacity
            className="absolute -right-1 -top-24"
            onPress={() => setImageFromGalleryAndCamera("")}
          >
            <FontAwesome5 name="times" size={16} />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row">
          <TouchableOpacity
            className="py-3 px-4 rounded-md"
            onPress={handleImageSelect}
          >
            <FontAwesome5 name="upload" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-4 rounded-md"
            onPress={() => setShowCamera(true)}
          >
            <FontAwesome5 name="camera" size={20} />
          </TouchableOpacity>
        </View>
      )}
      {showCamera && (
        <CameraModal
          setShowCamera={setShowCamera}
          setImage={setImageFromGalleryAndCamera}
        />
      )}
    </View>
  );
};

export default UploadAndShowPicture;
