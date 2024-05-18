import { FlatList, View, Text, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostList } from "../redux/reducer/postReducer";
import PostItem from "../component/PostItem";
import { useFocusEffect } from "@react-navigation/native";

const AllPostPage = () => {
  const { postList, loading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(getPostList());
    }, [dispatch])
  );

  return (
    <View>
      <FlatList
        data={postList}
        ItemSeparatorComponent={
          <View className="h-[2px] bg-gray-300 mx-auto w-[91%]"></View>
        }
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <PostItem post={item} />}
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
