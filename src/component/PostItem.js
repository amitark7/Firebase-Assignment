import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import RenderHTML from "react-native-render-html";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getComments } from "../redux/reducer/commentReducer";

const PostItem = ({ post }) => {
  const { width } = useWindowDimensions();
  const [toggleSeeMore, setToggleSeeMore] = useState(false);
  const [commentTxt, setCommentTxt] = useState("");
  const [commentList, setCommentList] = useState([]);
  const { userDetails } = useSelector((state) => state.userDetails);
  const { loading, comments } = useSelector((state) => state.comments);
  const dispatch = useDispatch();

  const addComments = async () => {
    const newComment = {
      postId: post.id,
      comment: commentTxt,
      uid: userDetails.uid,
      profilePic: userDetails.picture,
      displayName: `${userDetails.firstName} ${userDetails.lastName}`,
    };
    await dispatch(addComment(newComment));
    setCommentTxt("");
  };

  const fetchComments = async () => {
    await dispatch(getComments);
    setCommentList(comments);
  };

  useEffect(() => {
    dispatch(getComments(post.id));
  }, []);

  return (
    <View className="w-[95%] mx-auto border-gray-200 bg-white rounded-lg mb-4 border shadow-lg">
      <View className="flex flex-row items-center gap-3 mb-2 mt-1 mx-1">
        <Image
          className="h-8 w-8 rounded-full"
          source={{ uri: post?.profilePic }}
        />
        <View>
          <Text className="font-bold text-sm">{post.displayName}</Text>
          <Text className="text-[9px] text-gray-400">
            {moment(post.createdAt).format("DD MMM YYYY HH:mm")}
          </Text>
        </View>
      </View>
      <Image source={{ uri: post.picture }} className="w-full h-40 mb-2" />
      <View className="pb-1 px-2">
        <Text className="text-base leading-4 font-bold mb-2">{post.title}</Text>
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
            <Text className="text-xs text-blue-400">
              {toggleSeeMore ? "See Less" : "See More..."}
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex flex-row flex-wrap gap-1 mt-1">
          <FlatList
            data={post?.taggedUsers}
            horizontal={true}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="m-1 p-[2px] border-gray-200 border rounded-3xl flex flex-row items-center justify-center">
                <View className="m-1">
                  <FontAwesome5 name="user" size={8} color="black" />
                </View>
                <Text className="font-400 text-[9px] mr-1 pr-1">{item}</Text>
              </View>
            )}
          />
        </View>
        <View className="relative">
          <TextInput
            placeholder="Add comment"
            className="border border-gray-300 rounded-lg p-1 pl-2"
            onChangeText={(txt) => setCommentTxt(txt)}
          />
          <TouchableOpacity
            className="absolute right-2 top-[25%]"
            onPress={addComments}
          >
            {loading ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <FontAwesome5 name="plus" color="#000" size={18} />
            )}
          </TouchableOpacity>
        </View>
        <View>
          {
            <FlatList
              data={commentList}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View>
                  <Image source={{ uri: item.profilePic }} />
                  <View>
                    <Text>{item.displayName}</Text>
                    <Text>{item.comment}</Text>
                  </View>
                </View>
              )}
            />
          }
        </View>
      </View>
    </View>
  );
};

export default PostItem;
