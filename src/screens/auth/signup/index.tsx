import { Text, ScrollView, View, KeyboardAvoidingView, Platform, Image } from "react-native";
import React, { useState, FC, useEffect } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";

//third party imports
import { Button, TextInput, HelperText } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
//my imports
import { colors, gStyles, PaperTheme } from "@theme";

import { styles } from "./styles";
import Spinner from "react-native-loading-spinner-overlay";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { AuthStackScreenProps } from "@navigation-types";
import { useAuthContext } from "@context";
import { ToastService } from "@utility";

interface IForm {
  email: string;
  name: string;
  password: string;
}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  email: yup.string().email("Must be valid email.").required("Email is required."),
  name: yup
    .string()
    .min(2, "Name is too short.")
    .max(80, "Name is too long.")
    .required("Name is required."),
  password: yup.string().min(3, "Password too Short!").required("Password is required."),
});

const SignUp: FC<AuthStackScreenProps<"Register">> = ({ navigation, route }) => {
  const [secureEntry, setSecureEntry] = useState<boolean>(true);
  const [icon, setIcon] = useState<string>("eye");
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const {
    login,
    state: { isLoading },
  } = useAuthContext();
  const [requestId, setRequestId] = React.useState("");

  const initialValues: IForm = {
    email: "",
    name: "",
    password: "",
  };
  const { errors, values, handleBlur, handleChange, handleSubmit, touched } = useFormik<IForm>({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      ToastService.show("Demo sign up...");
    },
    validationSchema: schema,
  });
  const continueSignUp = (values: IForm, helpers: FormikHelpers<IForm>) => {};
  return (
    //safe are container
    <SafeAreaView style={styles.mainContainer}>
      <Spinner visible={spinnerLoading} cancelable={false} animation="fade" size="large" />
      {/* provides keyboard safe */}
      <KeyboardAvoidingView
        style={styles.keyboardViewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* text above input fields */}
        <ScrollView
          style={styles.modalStyle}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.textContainer}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/add-user.png")}
                style={{
                  // flex: 1,
                  width: 150,
                  height: 150,
                  tintColor: colors.primary,
                  borderWidth: 0,
                  // height: 100,
                }}
                resizeMethod="resize"
                resizeMode="contain"
              />
              {/* <Text style={[gStyles.mediumTitleText, { marginTop: -60, marginBottom: 20 }]}>Smart Machine</Text> */}
              {/* <Text style={[gStyles.descText, { fontSize: 18, marginTop: -60, marginBottom: 20 }]}>Smart Machine</Text> */}
            </View>
            <Text style={gStyles.headerText}>Sign Up</Text>
            <Text style={gStyles.descText}>Please enter your account info,</Text>
            <Text style={gStyles.descText}>
              in the fields
              <Text style={gStyles.descTextPrimaryBold}> below</Text>
            </Text>
          </View>
          {/* username and password fields container */}
          <View style={styles.inputContainer}>
            {/* username field container */}
            <View style={styles.textFieldContainer}>
              {/* TODO - change TextInput to _TextInput */}
              <TextInput
                dense
                theme={PaperTheme}
                mode="outlined"
                label="Email"
                keyboardType="email-address"
                value={values.email}
                outlineColor={colors.borderColor}
                selectionColor={colors.primary}
                clearButtonMode="while-editing"
                activeOutlineColor={colors.primary}
                error={errors.email && touched.email ? true : false}
                onBlur={handleBlur("email")}
                onChangeText={handleChange("email")}
                style={{
                  fontSize: 16,
                  color: colors.textGray,
                }}
                left={<TextInput.Icon icon="email" color={colors.iconGray} />}
              />
              {errors.email && touched.email ? (
                <HelperText type="error" selectable={false} style={gStyles.formErrorText}>
                  {errors.email}
                </HelperText>
              ) : null}
            </View>
            <View style={styles.textFieldContainer}>
              <TextInput
                dense
                theme={PaperTheme}
                mode="outlined"
                autoCapitalize="none"
                label="Full Name"
                value={values.name}
                outlineColor={colors.borderColor}
                selectionColor={colors.primary}
                activeOutlineColor={colors.primary}
                clearButtonMode="while-editing"
                error={errors.name && touched.name ? true : false}
                onBlur={handleBlur("name")}
                onChangeText={handleChange("name")}
                style={{
                  fontSize: 16,
                  color: colors.textGray,
                }}
                left={<TextInput.Icon icon="account" color={colors.iconGray} />}
              />
              {errors.name && touched.name ? (
                <HelperText type="error" selectable={false} style={gStyles.formErrorText}>
                  {errors.name}
                </HelperText>
              ) : null}
            </View>
            {/* password field container */}
            <View style={styles.textFieldContainer}>
              <TextInput
                dense
                theme={PaperTheme}
                mode="outlined"
                autoCapitalize="none"
                label="Password"
                value={values.password}
                outlineColor={colors.borderColor}
                selectionColor={colors.primary}
                activeOutlineColor={colors.primary}
                clearButtonMode="while-editing"
                error={errors.password && touched.password ? true : false}
                onBlur={handleBlur("password")}
                onChangeText={handleChange("password")}
                secureTextEntry={secureEntry}
                style={{
                  fontSize: 16,
                  color: colors.textGray,
                }}
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
              {errors.password && touched.password ? (
                <HelperText type="error" selectable={false} style={gStyles.formErrorText}>
                  {errors.password}
                </HelperText>
              ) : null}
            </View>
          </View>
          {/* login button container */}
          <View style={styles.buttonContainer}>
            <Button mode="contained" theme={PaperTheme} loading={isLoading} onPress={handleSubmit}>
              Sign Up
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
