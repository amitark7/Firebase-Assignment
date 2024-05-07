import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const CameraModal = ({visible,setShowCamera,setFormData,formData}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setFormData({...formData,picture:data.uri});
      setShowCamera(false)
    }
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <Modal visible={visible} className="flex-1">
      <View className="flex-1">
        <Camera
          ref={(ref) => setCamera(ref)}
          className="flex-1"
          type={type}
        />
        <View className="flex-row justify-between items-center p-5">
          <TouchableOpacity
            className="p-4 rounded-full bg-gray-500"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome5 name={"sync"} size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 rounded-full bg-gray-500"
            onPress={() => takePicture()}
          >
            <FontAwesome5 name={"camera"} size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CameraModal;
