import React from "react";
import { Text, View, Modal, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

const ConfirmationModal = ({
  modalTitle,
  modalSubTitle,
  btnOkText,
  btnCancelText,
  onConfirm,
  onClose,
  visible,
  btnColor = "bg-green-300",
}) => {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      onRequestClose={() => {}}
    >
      <View className="flex-1">
        <View className="fixed inset-0 flex-1 justify-center items-center">
          <View className="modal-overlay fixed inset-0 bg-red-500 opacity-50"></View>
          <View
            className="modal-container bg-gray-200  w-[80%] md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto flex flex-col "
          >
            <View className="modal-content py-6 text-left px-10">
              <View className="flex flex-row justify-between items-center pb-3 mb-1">
                <Text className="text-lg font-bold">{modalTitle}</Text>
                {btnCancelText && (
                  <Pressable onPress={onClose}>
                    <Entypo name="cross" size={28} color="black" />
                  </Pressable>
                )}
              </View>
              <Text className="mb-6">{modalSubTitle}</Text>
              <View
                className={`mt-7 flex flex-row gap-2 ${
                  btnCancelText ? "justify-between" : "justify-end"
                }`}
              >
                {btnCancelText && (
                  <Pressable onPress={onClose}>
                    <View className="px-4 py-2 text-gray-800 rounded-md border hover:bg-gray-400">
                      <Text>{btnCancelText}</Text>
                    </View>
                  </Pressable>
                )}
                <Pressable onPress={onConfirm}>
                  <View
                    className={`px-4 py-2 text-gray-800 rounded-md ${btnColor} text-white`}
                  >
                    <Text>{btnOkText}</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
