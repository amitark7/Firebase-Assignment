import { Image, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import RenderHTML from "react-native-render-html";
import { FontAwesome5 } from "@expo/vector-icons";

const PostItem = ({ post }) => {
  const { width } = useWindowDimensions();
  return (
    <View className="w-full rounded p-4 mb-4">
      <Image
        source={{ uri: post.picture }}
        className="w-full h-40 mb-2 rounded"
      />
      <Text className="text-lg font-bold mb-2">{post.title}</Text>
      <RenderHTML contentWidth={width} source={{ html: post.description }} />
      <View className="flex-1 flex-row flex-wrap gap-1 mt-1">
        {post.taggedUsers?.map((tag) => {
          return (
            <View className="p-1 bg-gray-300 rounded-lg w-max flex flex-row justify-center items-center gap-1">
              <FontAwesome5 name="user" size={10} color="black" />
              <Text className="font-400">{tag}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PostItem;
