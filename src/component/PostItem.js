import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import RenderHTML from "react-native-render-html";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";

const PostItem = ({ post }) => {
  const { width } = useWindowDimensions();
  const [toggleSeeMore, setToggleSeeMore] = useState(false);

  return (
    <View className="w-[90%] mx-auto border-gray-400 rounded mb-4 border shadow-lg">
      <Image source={{ uri: post.picture }} className="w-full h-52 mb-2" />
      <View className="py-1 px-2">
        <Text className="text-lg font-bold mb-2">{post.title}</Text>
        <RenderHTML
          contentWidth={width}
          source={{
            html: `${
              toggleSeeMore
                ? post.description
                : post.description.substring(0, 200)
            }`,
          }}
        />
        {post.description.length > 200 && (
          <TouchableOpacity
            className="mt-2"
            onPress={() => setToggleSeeMore(!toggleSeeMore)}
          >
            <Text className="text-sm text-blue-400">
              {toggleSeeMore ? "See Less" : "See More..."}
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex flex-row items-center gap-3 mt-1">
          <Image
            className="h-12 w-12 rounded-full"
            source={{ uri: post?.profilePic }}
          />
          <View>
            <Text className="font-bold text-xl">{post.displayName}</Text>
            <Text className="text-gray-400">
              {moment(post.createdAt).format("DD MMM YYYY")}
            </Text>
          </View>
        </View>
        <View className="flex flex-row flex-wrap gap-1 mt-1">
          <FlatList
            data={post?.taggedUsers}
            horizontal={true}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="p-1 m-1 bg-gray-300 rounded-lg flex flex-row items-center justify-center">
                <View className="m-1">
                  <FontAwesome5 name="user" size={10} color="black" />
                </View>
                <Text className="font-400 mr-1 pr-1 text-[13px]">{item}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default PostItem;
