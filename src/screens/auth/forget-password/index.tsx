import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import type { FC } from "react";
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, gStyles, PaperTheme, theme } from "@theme";
import type { AuthStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";

import { styles } from "./styles";

const ForgotPassword: FC<AuthStackScreenProps<"ForgetPassword">> = ({}) => {
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
              // eslint-disable-next-line import/extensions
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
              // style={{
              //   fontSize: theme.fontSize.md,
              //   color: colors.textGray,
              // }}
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
              paddingVertical: theme.spacing.md,
            }}
          >
            Reset Password
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export { ForgotPassword };
