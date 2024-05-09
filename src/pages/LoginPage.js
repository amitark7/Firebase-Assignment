import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { NativeModules } from "react-native";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import {
  auth,
  fbProvider,
  googleProvider,
  twiiterProvider,
} from "../firebase/firebaseConfig";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { validateForm } from "../utils/validationCheck";
import { saveSocialAuthData, userLogin } from "../redux/reducer/authReducer";
import ErrorComponent from "../component/ErrorComponent";

const LoginPage = ({ navigation }) => {
  const { RNTwitterSignIn } = NativeModules;
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleInputChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const onLoginSubmit = async () => {
    const { isValid, errors } = validateForm(userData, true);
    if (isValid) {
      const result = await dispatch(userLogin(userData));
      if (result.payload?.code === "auth/invalid-credential") {
        setErrors({ ...errors, authError: "Email or Password is incorrect" });
      } else {
        navigation.replace("HomePage");
      }
    } else {
      setErrors(errors);
    }
  };

  const onSocialClick = async (provider) => {
    try {
      if (Platform.OS === "web") {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userSocialData = {
          userUID: user.uid,
          firstName: user.displayName.split(" ")[0],
          lastName: user.displayName.split(" ")[1],
          email: user.email,
          phoneNumber: user.phoneNumber,
          pictureUrl: user.photoURL,
        };
        try {
          await dispatch(saveSocialAuthData(userSocialData));
          navigation.navigate("HomePage");
        } catch (error) {
          console.log(error);
        }
      } else {
        if (provider === fbProvider) {
          const result = await LoginManager.logInWithPermissions([
            "public_profile",
            "email",
          ]);
          if (result.isCancelled) {
            console.log("User cancelled");
            return;
          }
          const accessToken = await AccessToken.getCurrentAccessToken();
          if (!accessToken) {
            console.log("Something went wrong obtaining the access token");
            return;
          }
          const credential = FacebookAuthProvider.credential(accessToken.token);
          const firebaseUserCredential = await auth.signInWithCredential(
            credential
          );
          console.log(firebaseUserCredential.user);
        } else if (provider === googleProvider) {
          // if (Platform.OS === "android") {
          //   GoogleSignin.configure({
          //     webClientId:
          //       "190676815337-kkkuhlkq95u98pf0ala29a7d5p22oqpr.apps.googleusercontent.com",
          //   });
          // }
          // await GoogleSignin.hasPlayServices({
          //   showPlayServicesUpdateDialog: true,
          // });
          // const { idToken } = await GoogleSignin.signIn();
          // console.log(idToken);
          // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          // const userSiginValue = auth().signInWithCredential(googleCredential);
          // console.log(userSiginValue);
        } else if (provider === twiiterProvider) {
          RNTwitterSignIn.init(
            "eHZmRGZDZ1NvOHZBNnpyRFFURmg6MTpjaQ",
            "lifiDyrXequAZmaKToXYRBF4ICJzAJDX2NH9uZ_cdjoXTwJX4O"
          ).then(() => console.log("Twitter SDK initialized"));
          const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn();

          const twitterCredential = auth.TwitterAuthProvider.credential(
            authToken,
            authTokenSecret
          );

          const userSignIn = auth().signInWithCredential(twitterCredential);
          console.log(userSignIn);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 flex-col items-center justify-center">
      <View className="border bg-white w-[90%] sm:w-1/2 md:w-2/5 xl:w-1/3 2xl:w-1/4 py-10 px-5 text-center border-gray-200 rounded-lg mx-auto mt-20 shadow-lg">
        <Text className="text-3xl font-semibold mb-6 text-center">Login</Text>
        <View className="w-full mb-6">
          <TextInput
            className={`w-full rounded-md py-3 pl-2 outline-none border-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Email ID"
            value={userData.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
          <ErrorComponent errorMessage={errors.email} />
        </View>
        <View className="w-full mb-6">
          <TextInput
            className={`w-full rounded-md py-3 pl-2 outline-none border-2 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password"
            secureTextEntry={true}
            value={userData.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          <ErrorComponent errorMessage={errors.password} />
          <ErrorComponent errorMessage={errors.authError} />
        </View>
        <TouchableOpacity
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } py-2 text-xl rounded-md mb-4 font-semibold`}
          onPress={onLoginSubmit}
          disabled={loading}
        >
          <Text className="text-white text-center">
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text>Login</Text>
            )}
          </Text>
        </TouchableOpacity>
        <Text className="text-base text-center mb-3">
          Don't have an account?{" "}
          <Text
            className="text-blue-500"
            onPress={() => navigation.navigate("UserRegisterPage")}
          >
            Register
          </Text>
        </Text>
        <Text className="text-center">----------Or-----------</Text>
        <View className="flex flex-row justify-center gap-5 mt-1">
          <TouchableOpacity onPress={() => onSocialClick(fbProvider)}>
            <FontAwesome5 name={"facebook"} size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSocialClick(googleProvider)}>
            <FontAwesome5 name={"google"} size={32} color="#db4437" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSocialClick(twiiterProvider)}>
            <FontAwesome5 name={"twitter"} size={32} color="#1da1f2" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginPage;
