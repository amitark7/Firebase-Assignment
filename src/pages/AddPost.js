import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { createRef, useState } from "react";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import { handleImagePicker } from "../utils/handleImagePicker";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const AddPost = () => {
  const _editor = createRef();
  const richText = createRef();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleImageSelect = async () => {
    const imageURL = await handleImagePicker();
    setImage(imageURL);
  };
  
  const handleSave = () => {
    console.log("Title:", title);
    console.log("Image:", image);
    console.log("Description:", description);
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View className="flex-1 justify-center">
        <View className="w-[90%] sm:w-[50%] lg:w-[35%] 2xl:w-[30%] bg-gray-300 mx-auto py-8 px-8 mb-10 rounded-lg shadow-lg">
          <Text className="text-center text-2xl font-bold mb-2">Add Post</Text>
          <TextInput
            className="border border-white bg-white rounded-md mb-2 px-4 py-2 sm:py-3"
            placeholder="Enter title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <TouchableOpacity
            className="py-3 px-4 bg-blue-500 rounded-md mb-2"
            onPress={handleImageSelect}
          >
            <Text className="text-center text-white">Select Image</Text>
          </TouchableOpacity>
          {/* <QuillEditor
            container={true}
            ref={_editor}
            onTextChange={({html, delta, oldContents, source })=>{
              console.log("On Text Change",html,delta);
              setDescription(html)
            }}
            onEditorChange={({name,args})=>{
              console.log("On Editor Change",name,args[0]);
            }}
            onHtmlChange={(value)=>{
              console.log(value);
            }}
            className="h-[180px] mb-2 rounded bg-gray-600 border-red-400"
          /> */}
          <RichEditor
            ref={richText}
            onChange={(descriptionText) => {
              console.log("descriptionText:", descriptionText);
              setDescription(descriptionText);
            }}
          />
          <RichToolbar
            editor={richText}
            // actions={[
            //   actions.setBold,
            //   actions.setItalic,
            //   actions.setUnderline,
            //   actions.heading1,
            // ]}
            // iconMap={{ [actions.heading1]: handleHead }}
          />
          {/* <QuillToolbar editor={_editor} options="full" theme="light" /> */}
          {image && (
            <Image source={{ uri: image }} className="h-[100px] w-[100px] mt-2" />
          )}
          <TouchableOpacity
            className="p-3 bg-blue-500 rounded-md mt-4"
            onPress={handleSave}
          >
            <Text className="text-center text-white">Add Post</Text>
          </TouchableOpacity>
          <View>
            <Text>{`${description}`}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddPost;
