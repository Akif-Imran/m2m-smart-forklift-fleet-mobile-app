/* eslint-disable camelcase */
import { View } from "react-native";
import React from "react";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import type { FormikHelpers } from "formik";
import { useFormik } from "formik";
import * as yup from "yup";
import { _TextInput } from "@components";
import { ScrollView } from "react-native-gesture-handler";
import { Button, TextInput } from "react-native-paper";
import { PaperTheme, colors } from "@theme";
import { useAuthContext } from "@context";
import { changePassword } from "@services";
import { ToastService } from "@utility";

import { styles } from "./styles";
// import { ToastService } from "@utility";

interface IForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .oneOf([yup.ref("confirm_password")], "New Password must match")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("new_password")], "New Password must match")
    .required("Confirm New Password is required"),
});

const ChangePassword: React.FC<
  ProfileSettingsStackScreenProps<"ChangePassword">
> = ({ navigation }) => {
  const {
    state: { token },
  } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [secureEntry1, setSecureEntry1] = React.useState<boolean>(true);
  const [secureEntry2, setSecureEntry2] = React.useState<boolean>(true);
  const [secureEntry3, setSecureEntry3] = React.useState<boolean>(true);
  const {} = useAuthContext();

  const changePass = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    console.log(values);
    changePassword(token, {
      old_password: values.oldPassword,
      new_password: values.newPassword,
    })
      .then((res) => {
        ToastService.show(res?.message);
        if (res.success) {
          helpers.resetForm();
          navigation.goBack();
        }
      })
      .catch((_err) => {
        console.log(_err?.message);
        ToastService.show("Error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const form = useFormik<IForm>({
    initialValues: {
      oldPassword: "",
      confirmPassword: "",
      newPassword: "",
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
            value={form.values.oldPassword}
            onChangeText={form.handleChange("old_password")}
            onBlur={form.handleBlur("old_password")}
            placeholder="Old Password"
            secureTextEntry={secureEntry1}
            error={form.touched.oldPassword && !!form.errors.oldPassword}
            errorText={form.errors.oldPassword}
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
            value={form.values.newPassword}
            onChangeText={form.handleChange("new_password")}
            onBlur={form.handleBlur("new_password")}
            placeholder="New Password"
            secureTextEntry={secureEntry2}
            error={form.touched.newPassword && !!form.errors.newPassword}
            errorText={form.errors.newPassword}
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
            value={form.values.confirmPassword}
            onChangeText={form.handleChange("confirm_password")}
            onBlur={form.handleBlur("confirm_password")}
            placeholder="Confirm New Password"
            secureTextEntry={secureEntry3}
            error={
              form.touched.confirmPassword && !!form.errors.confirmPassword
            }
            errorText={form.errors.confirmPassword}
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
