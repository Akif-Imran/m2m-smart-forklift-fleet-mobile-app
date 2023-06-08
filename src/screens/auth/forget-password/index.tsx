import { Text, View, KeyboardAvoidingView, Platform, Image } from "react-native";
import React, { useState, FC, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";

//third party imports
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
//my imports
import { colors, gStyles, PaperTheme } from "@theme";
import { AuthStackScreenProps } from "@navigation-types";
import { styles } from "./styles";
import { ToastService } from "@utility";

const ForgotPassword: FC<AuthStackScreenProps<"ForgetPassword">> = ({ navigation, route }) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      ToastService.show("Demo Password Reset");
    }, 2000);
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
          <View style={styles.imgContainer}>
            <Image
              source={require("@assets/images/forgot-password.png")}
              style={styles.imgStyle}
              resizeMethod="resize"
              resizeMode="contain"
            />
          </View>
          <Text style={gStyles.headerText}>Forgot Password</Text>
          <Text style={gStyles.descText}>Please enter your email address</Text>
          <Text style={gStyles.descText}>
            to reset
            <Text style={gStyles.descTextPrimaryBold}> Password</Text>
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
              outlineColor={colors.borderColor}
              selectionColor={colors.primary}
              clearButtonMode="while-editing"
              activeOutlineColor={colors.primary}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: 16,
                color: colors.textGray,
              }}
              left={<TextInput.Icon icon="email" color={colors.iconGray} />}
            />
          </View>
        </View>
        {/* login button container */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            theme={PaperTheme}
            loading={isLoading}
            onPress={resetPassword}
            style={{
              paddingVertical: 8,
            }}
          >
            Reset Password
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
