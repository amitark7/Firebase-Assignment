import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import RenderHTML from "react-native-render-html";
import { FontAwesome5 } from "@expo/vector-icons";

const PostItem = ({ post }) => {
  const { width } = useWindowDimensions();
  const [toggleShowMore, setToggleShowMore] = useState(false);

  return (
    <View className="w-[90%] mx-auto border-gray-400 rounded mb-4 border shadow-lg">
      <Image source={{ uri: post.picture }} className="w-full h-52 mb-2" />
      <View className="p-2">
        <Text className="text-lg font-bold mb-2">{post.title}</Text>
        <RenderHTML
          contentWidth={width}
          source={{
            html: `${
              toggleShowMore
                ? post.description
                : post.description.substring(0, 200)
            }`,
          }}
        />
        {post.description.length > 200 && (
          <TouchableOpacity
            className="mt-2"
            onPress={() => setToggleShowMore(!toggleShowMore)}
          >
            <Text className="text-sm">
              {toggleShowMore ? "See Less" : "See More..."}
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex flex-row flex-wrap gap-1 mt-1">
          {post.taggedUsers?.map((tag, index) => {
            return (
              <View
                key={index}
                className="p-1 bg-gray-300 rounded-lg flex flex-row items-center justify-center"
              >
                <View className="m-1">
                  <FontAwesome5 name="user" size={10} color="black" />
                </View>
                <Text className="font-400 mr-1 pr-1 text-[13px]">{tag}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default PostItem;
