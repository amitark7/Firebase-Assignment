import { FlatList, View, ActivityIndicator } from "react-native";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getPostList } from "../redux/reducer/postReducer";
import PostItem from "../component/PostItem";
import { getComments } from "../redux/reducer/commentReducer";

const AllPostPage = ({navigation}) => {
  const { postList, loading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(getPostList());
      dispatch(getComments())
    }, [dispatch])
  );

  return (
    <View className="py-4 flex-1">
      <FlatList
        data={postList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <PostItem post={item} navigation={navigation}/>}
        ListFooterComponent={
          loading && (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size={"large"} />
            </View>
          )
        }
      />
    </View>
  );
};

export default AllPostPage;
