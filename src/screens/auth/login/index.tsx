import { Text, View, KeyboardAvoidingView, Platform, Image } from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";
//third party imports
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
//my imports
import { colors, gStyles, PaperTheme } from "@theme";
import { useAuthContext } from "@context";
import { AuthStackScreenProps } from "@navigation-types";
import { styles } from "./styles";

const Login: React.FC<AuthStackScreenProps<"Login">> = ({ navigation, route }) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [secureEntry, setSecureEntry] = React.useState<boolean>(true);
  const [icon, setIcon] = React.useState<string>("eye");
  const {
    login,
    state: { isLoading },
  } = useAuthContext();

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  const goToForgetPassword = () => {
    navigation.navigate("ForgetPassword");
  };

  const handleLogin = () => {
    login(email, password, true);
  };
  return (
    //safe are container
    <SafeAreaView style={styles.mainContainer}>
      {/* provides keyboard safe */}
      <KeyboardAvoidingView
        style={styles.keyboardViewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* text above input fields */}
        <View style={styles.textContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/images/adaptive-icon.png")}
              style={styles.imageStyle}
              resizeMethod="resize"
              resizeMode="contain"
            />
            <Text style={[gStyles.headerText, { marginTop: -60 }]}>Smart Forklift</Text>
          </View>
          {/* <Text style={gStyles.headerText}>Login</Text> */}
          <Text style={gStyles.descText}>If you don't have an account,</Text>
          <Text style={gStyles.descText}>
            please start{" "}
            <Text
              style={[gStyles.descTextPrimaryBold, { textDecorationLine: "underline" }]}
              onPress={goToRegister}
            >
              here
            </Text>
          </Text>
        </View>
        {/* username and password fields container */}
        <View style={styles.inputContainer}>
          {/* username field container */}
          <View style={styles.textFieldContainer}>
            <TextInput
              theme={PaperTheme}
              mode="outlined"
              label="Email"
              keyboardType="email-address"
              value={email}
              autoCapitalize="none"
              outlineColor={colors.borderColor}
              selectionColor={colors.primary}
              clearButtonMode="while-editing"
              activeOutlineColor={colors.primary}
              onChangeText={(text) => setEmail(text)}
              style={styles.textInputStyle}
              left={<TextInput.Icon icon="email" color={colors.iconGray} />}
            />
          </View>
          {/* password field container */}
          <View style={styles.textFieldContainer}>
            <TextInput
              theme={PaperTheme}
              mode="outlined"
              autoCapitalize="none"
              label="Password"
              value={password}
              outlineColor={colors.borderColor}
              selectionColor={colors.primary}
              clearButtonMode="while-editing"
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={secureEntry}
              style={styles.textInputStyle}
              left={
                <TextInput.Icon
                  icon={() => <Fontisto name="locked" color={colors.iconGray} size={20} />}
                />
              }
              right={
                <TextInput.Icon
                  icon={icon}
                  color={colors.iconGray}
                  onPress={() => {
                    setSecureEntry(!secureEntry);
                    setIcon((prev) => (prev === "eye" ? "eye-off" : "eye"));
                  }}
                />
              }
            />
          </View>
          {/* forgot password container */}
          <View style={styles.forgotPasswordContainer}>
            <Text
              style={[
                gStyles.descTextPrimaryBold,
                { textAlign: "center", textDecorationLine: "underline" },
              ]}
              onPress={goToForgetPassword}
            >
              Forgot the password?
            </Text>
          </View>
        </View>
        {/* login button container */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            theme={PaperTheme}
            loading={isLoading}
            onPress={handleLogin}
            style={styles.buttonStyle}
          >
            LOG IN
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
