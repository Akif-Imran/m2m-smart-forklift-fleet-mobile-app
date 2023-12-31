import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Button,
  Card,
  Modal,
  Portal,
  TouchableRipple,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import type { FormikHelpers } from "formik";
import { useFormik } from "formik";
import Toast from "react-native-root-toast";
import * as yup from "yup";
import { PaperTheme, colors, gStyles } from "@theme";
import { _TextInput } from "@components";
import { useAuthContext } from "@context";
import { ToastService } from "@utility";
import { deleteChecklistItem, updateChecklistItem } from "@services";

import { styles } from "./styles";

interface IForm {
  name: string;
}
const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup
    .string()
    .min(3, "Too short!")
    .required("Name of Job Type is required."),
});

interface OwnProps {
  label: string;
  checklistItemId: number;
  handleRefresh: () => void;
}

const _ChecklistListCard: React.FC<OwnProps> = ({
  label,
  checklistItemId,
  handleRefresh,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const [visible, setVisible] = React.useState<boolean>(false);

  const hideModal = () => setVisible(false);

  const handleEdit = (values: IForm, _helpers: FormikHelpers<IForm>) => {
    updateChecklistItem(token, {
      id: checklistItemId,
      name: values.name,
    })
      .then((res) => {
        ToastService.show(res?.message || "N/A");
        if (res.success) {
          hideModal();
        }
      })
      .catch((_err) => {
        ToastService.show("Update checklist error");
      })
      .finally(() => {
        handleRefresh();
      });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Checklist Item",
      "Are you sure you want to delete this Checklist Item",
      [
        {
          text: "Cancel",
          onPress: () => Toast.show("Operation cancelled!"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeleteServiceType(),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => Toast.show("Operation cancelled!"),
      }
    );
  };

  const handleDeleteServiceType = () => {
    //api call
    deleteChecklistItem(token, checklistItemId)
      .then((res) => {
        ToastService.show(res?.message || "N/A");
      })
      .catch((_err) => {
        ToastService.show("An error occurred");
      })
      .finally(() => {
        handleRefresh();
      });
  };

  const form = useFormik<IForm>({
    initialValues: {
      name: label,
    },
    onSubmit: (values, helpers) => {
      handleEdit(values, helpers);
    },
    validationSchema: schema,
  });

  return (
    <Card style={styles.card} theme={PaperTheme} elevation={0}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalStyle}
        >
          {/* <Text style={[styles.headerText, { paddingLeft: 8 }]}> */}
          <Text style={gStyles.tblHeaderText}>Checklist Item</Text>
          <View style={styles.orderInputContainer}>
            <_TextInput
              dense
              value={form.values.name}
              label={"Name"}
              onBlur={form.handleBlur("name")}
              onChangeText={form.handleChange("name")}
              error={form.errors.name && form.touched.name ? true : false}
              errorText={form.errors.name}
            />
          </View>
          <Button
            theme={PaperTheme}
            mode="contained"
            onPress={() => form.handleSubmit()}
            labelStyle={{ ...gStyles.cardTitleText, color: colors.white }}
          >
            Ok
          </Button>
        </Modal>
      </Portal>
      <View style={styles.labelContainer}>
        <Text style={StyleSheet.compose(gStyles.tblDescText, { flex: 1 })}>
          {label}
        </Text>
        <TouchableRipple
          style={styles.button}
          theme={PaperTheme}
          onPress={() => setVisible(true)}
        >
          <MaterialIcons name="edit" size={20} color={colors.iconGray} />
        </TouchableRipple>
        <TouchableRipple
          style={styles.button}
          theme={PaperTheme}
          onPress={handleDelete}
        >
          <MaterialIcons name="delete" size={20} color={colors.error} />
        </TouchableRipple>
      </View>
    </Card>
  );
};

export { _ChecklistListCard };
