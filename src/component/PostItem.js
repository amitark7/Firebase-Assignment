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
import {
  addComment,
  deleteComment,
  updateComment,
} from "../redux/reducer/commentReducer";
import {
  addAndDeleteCommentIdInPost,
  deletePost,
} from "../redux/reducer/postReducer";
import ConfirmationModal from "./ConfirmationModal";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

const PostItem = ({ post, navigation }) => {
  const { width } = useWindowDimensions();
  const [toggleSeeMore, setToggleSeeMore] = useState(false);
  const [commentTxt, setCommentTxt] = useState("");
  const [showConfiramtionModal, setShowConfirmationModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userDetails } = useSelector((state) => state.userDetails);
  const { loading, comments } = useSelector((state) => state.comments);
  const dispatch = useDispatch();

  const menuOptions = [
    {
      name: "Update",
      icon: "pen",
      action: () => updatePostClick(),
    },
    {
      name: "Delete",
      icon: "trash",
      action: () => deletePostClick(),
    },
  ];

  const updatePostClick = () => {
    navigation.navigate("Update Post", { post });
    setIsMenuOpen(false);
  };

  const deletePostClick = () => {
    setShowConfirmationModal(true);
    setIsMenuOpen(false);
  };

  const addAndUpdateComment = async () => {
    const newComment = {
      postId: post.id,
      commentTitle: commentTxt,
      commentedBy: userDetails.uid,
      profilePic: userDetails.picture,
      displayName: `${userDetails.firstName} ${userDetails.lastName}`,
    };
    try {
      if (selectedComment) {
        await dispatch(
          updateComment({ ...selectedComment, commentTitle: commentTxt })
        );
        setCommentList(
          commentList.map((comment) => {
            if (comment.id === selectedComment.id) {
              return { ...comment, commentTitle: commentTxt };
            }
            return comment;
          })
        );
      } else {
        const response = await dispatch(addComment(newComment));
        setCommentList([
          ...commentList,
          { ...newComment, id: response?.payload },
        ]);
        dispatch(
          addAndDeleteCommentIdInPost({ post, commentId: response?.payload })
        );
      }
      setCommentTxt("");
      setSelectedComment(null);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteModalConfirm = async () => {
    try {
      if (selectedComment) {
        await dispatch(deleteComment(selectedComment.id));
        setCommentList(
          commentList.filter((comment) => comment.id !== selectedComment.id)
        );
        dispatch(
          addAndDeleteCommentIdInPost({
            post,
            commentId: selectedComment.id,
            isDelete: true,
          })
        );
      } else {
        dispatch(deletePost(post));
      }
      setShowConfirmationModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onCommentDeleteClick = (comment) => {
    setShowConfirmationModal(true);
    setSelectedComment(comment);
  };

  const selectEditComment = async (comment) => {
    setCommentTxt(comment.commentTitle);
    setSelectedComment(comment);
  };

  useEffect(() => {
    setCommentList(comments.filter((comment) => comment.postId === post.id));
  }, [comments]);

  return (
    <View className="w-[95%] mx-auto border-gray-200 bg-white rounded-lg mb-4 border shadow-lg">
      <View className="flex flex-row justify-between items-center my-3 mx-3 mr-5 relative">
        <View className="flex flex-row items-center gap-3">
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
        <Menu opened={isMenuOpen} onBackdropPress={() => setIsMenuOpen(false)}>
          <MenuTrigger onPress={() => setIsMenuOpen(true)}>
            {userDetails.uid === post.updatedBy && (
              <TouchableOpacity
                className="px-4"
                onPress={() => setIsMenuOpen(true)}
              >
                <FontAwesome5 name="ellipsis-v" size={20} color="#000" />
              </TouchableOpacity>
            )}
          </MenuTrigger>
          <MenuOptions>
            <View className="absolute py-1 px-4 w-[150px] bg-white rounded -top-8 -right-5 z-50">
              {menuOptions.map((option, index) => {
                return (
                  <MenuOption key={index}>
                    <TouchableOpacity
                      className="flex flex-row items-center gap-3 mb-1"
                      onPress={option.action}
                    >
                      <FontAwesome5 name={option.icon} size={12} color="#000" />
                      <Text>{option.name}</Text>
                    </TouchableOpacity>
                  </MenuOption>
                );
              })}
            </View>
          </MenuOptions>
        </Menu>
      </View>
      <Image source={{ uri: post.picture }} className="w-full h-40 mb-2 z-0" />
      <View className="pb-1 px-2">
        <Text className="text-base leading-4 font-bold mb-2">{post.title}</Text>
        {toggleSeeMore ? (
          <RenderHTML
            contentWidth={width}
            source={{ html: post.description }}
          />
        ) : (
          <RenderHTML
            contentWidth={width}
            source={{
              html: `${post.description.substring(0, 200)}`,
            }}
          />
        )}
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
        <View className="relative flex-1 flex-row items-center gap-1 mt-2">
          <Image
            className="h-9 w-9 rounded-full"
            source={{ uri: userDetails.picture }}
          />
          <TextInput
            placeholder="Add comment"
            value={commentTxt}
            className="border border-gray-300 rounded-lg pl-2 w-[85%] pr-7"
            onChangeText={(txt) => setCommentTxt(txt)}
            multiline={true}
            numberOfLines={3}
          />
          <TouchableOpacity
            className="absolute right-3 top-[30%]"
            disabled={commentTxt.length === 0 ? true : false}
            onPress={addAndUpdateComment}
          >
            {loading ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <FontAwesome5
                name="plus"
                color={commentTxt.length > 0 ? "green" : "#000"}
                size={20}
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="m-1 p-1 mb-1">
          {commentList.length > 0 && <Text>Comments {commentList.length}</Text>}
          <FlatList
            data={commentList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="flex flex-row items-center gap-1 my-[2px]">
                <Image
                  className="h-7 w-7 rounded-full"
                  source={{ uri: item.profilePic }}
                />
                <View className="w-[80%]">
                  <Text className="font-bold text-[12px]">
                    {item.displayName}
                  </Text>
                  <Text className="text-gray-600 text-[9px]">
                    {item.commentTitle}
                  </Text>
                </View>
                {userDetails.uid === item.commentedBy && (
                  <View className="absolute -right-2 flex flex-row gap-2">
                    <TouchableOpacity onPress={() => selectEditComment(item)}>
                      <FontAwesome5 name="pen" size={16} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onCommentDeleteClick(item)}
                    >
                      <FontAwesome5 name="trash" size={16} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
      {showConfiramtionModal && (
        <ConfirmationModal
          modalTitle={"Delete"}
          modalSubTitle={`Are You Sure You Want to Delete this ${
            selectedComment ? "Comment" : "Post"
          }`}
          btnColor={"bg-red-400"}
          btnCancelText={"Cancel"}
          btnOkText={"Delete"}
          onConfirm={() => onDeleteModalConfirm()}
          onClose={() => {
            setShowConfirmationModal(false);
            setSelectedComment(null);
          }}
        />
      )}
    </View>
  );
};

export default PostItem;
