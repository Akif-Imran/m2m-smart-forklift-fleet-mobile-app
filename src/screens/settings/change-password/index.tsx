import { View } from "react-native";
import React from "react";
import { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { _TextInput } from "@components";
import { ScrollView } from "react-native-gesture-handler";
import { Button, TextInput } from "react-native-paper";
import { PaperTheme, colors } from "@theme";
import { useAuthContext } from "@context";
// import { ToastService } from "@utility";

interface IForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  old_password: yup.string().required("Old password is required"),
  new_password: yup
    .string()
    .oneOf([yup.ref("confirm_password")], "New Password must match")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "New Password must match")
    .required("Confirm New Password is required"),
});

interface Props {}

const ChangePassword: React.FC<ProfileSettingsStackScreenProps<"ChangePassword">> = ({
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [secureEntry1, setSecureEntry1] = React.useState<boolean>(true);
  const [secureEntry2, setSecureEntry2] = React.useState<boolean>(true);
  const [secureEntry3, setSecureEntry3] = React.useState<boolean>(true);
  const {
    state: { token, user },
  } = useAuthContext();

  const changePass = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    // changePassword(token, {
    //   currentPassword: values.old_password,
    //   newPassword: values.new_password,
    // })
    //   .then((res) => {
    //     ToastService.show(res?.message);
    //     navigation.goBack();
    //   })
    //   .catch((err) => {
    //     ToastService.show("Error!");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const form = useFormik<IForm>({
    initialValues: {
      old_password: "",
      confirm_password: "",
      new_password: "",
    },
    onSubmit: (values, helpers) => {
      changePass(values, helpers);
    },
    validationSchema: schema,
  });
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <_TextInput
            label={"Current Password"}
            value={form.values.old_password}
            onChangeText={form.handleChange("old_password")}
            onBlur={form.handleBlur("old_password")}
            placeholder="Old Password"
            secureTextEntry={secureEntry1}
            error={form.touched.old_password && !!form.errors.old_password}
            errorText={form.errors.old_password}
            right={
              <TextInput.Icon
                icon={secureEntry1 ? "eye-off" : "eye"}
                color={colors.iconGray}
                onPress={() => {
                  setSecureEntry1(!secureEntry1);
                }}
              />
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <_TextInput
            label={"New Password"}
            value={form.values.new_password}
            onChangeText={form.handleChange("new_password")}
            onBlur={form.handleBlur("new_password")}
            placeholder="New Password"
            secureTextEntry={secureEntry2}
            error={form.touched.new_password && !!form.errors.new_password}
            errorText={form.errors.new_password}
            right={
              <TextInput.Icon
                icon={secureEntry2 ? "eye-off" : "eye"}
                color={colors.iconGray}
                onPress={() => {
                  setSecureEntry2(!secureEntry2);
                }}
              />
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <_TextInput
            label={"Confirm New Password"}
            value={form.values.confirm_password}
            onChangeText={form.handleChange("confirm_password")}
            onBlur={form.handleBlur("confirm_password")}
            placeholder="Confirm New Password"
            secureTextEntry={secureEntry3}
            error={form.touched.confirm_password && !!form.errors.confirm_password}
            errorText={form.errors.confirm_password}
            right={
              <TextInput.Icon
                icon={secureEntry3 ? "eye-off" : "eye"}
                color={colors.iconGray}
                onPress={() => {
                  setSecureEntry3(!secureEntry3);
                }}
              />
            }
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            theme={PaperTheme}
            mode="contained"
            onPress={() => form.handleSubmit()}
            loading={isLoading}
          >
            Save
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export { ChangePassword };
