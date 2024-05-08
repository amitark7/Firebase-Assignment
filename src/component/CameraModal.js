import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { Modal, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const CameraModal = ({ setShowCamera, setImage }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      setImage(data.uri);
      setShowCamera(false);
    }
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Modal
      visible={hasCameraPermission}
      animationType={"slide"}
      className="flex-1"
    >
      <View className="flex-1">
        <Camera ref={(ref) => setCamera(ref)} className="flex-1" type={type} />
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
