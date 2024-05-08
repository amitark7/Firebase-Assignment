import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ErrorComponent = ({ errorMessage }) => {
  return (
    errorMessage && (
      <View>
        <Text className="text-red-600">{errorMessage}</Text>
      </View>
    )
  );
};

export default ErrorComponent;
