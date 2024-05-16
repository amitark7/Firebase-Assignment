import React, { useState } from "react";
import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

const CameraModal = ({ setShowCamera, setImage }) => {
  const [facing, setFacing] = useState("back");
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      setImage(data.uri);
      setShowCamera(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <Modal
      visible={permission.granted}
      animationType={"slide"}
      className="flex-1"
    >
      <View className="flex-1">
        <CameraView
          ref={(ref) => setCamera(ref)}
          className="flex-1"
          facing={facing}
        >
          <View className="absolute bottom-3 w-full p-5">
            <View className="flex flex-row justify-between  items-center">
              <TouchableOpacity
                className="p-4 rounded-full bg-gray-500"
                onPress={toggleCameraFacing}
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
        </CameraView>
      </View>
    </Modal>
  );
};

export default CameraModal;
