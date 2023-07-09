import { StyleSheet, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import Spinner from "react-native-loading-spinner-overlay";
import {
  _DatePicker,
  _Divider,
  _DropDown,
  _ScrollFormLayout,
  _TextInput,
} from "@components";
import type { DriverStackScreenProps } from "@navigation-types";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastService } from "@utility";
import { Button, TextInput } from "react-native-paper";
import moment from "moment";

interface IForm
  extends Omit<IDriverActivity, "_id" | "image" | "name" | "email"> {
  driver: string;
}

const scheme: yup.ObjectSchema<IForm> = yup.object().shape({
  driver: yup.string().required("Required"),
  date: yup.string().required("Date is required"),
  description: yup.string().required("Description is required"),
  eventType: yup.string().required("Event Type is required"),
});

const AddActivity: React.FC<DriverStackScreenProps<"AddActivity">> = ({
  navigation,
  route,
}) => {
  const { mode } = route.params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [behaviorDate, setBehaviorDate] = React.useState<Date>(new Date());
  const [showBehaviorDatePicker, setShowBehaviorDatePicker] =
    React.useState(false);

  const [driverDropdownVisible, setDriverDropdownVisible] =
    React.useState(false);
  const [eventDropdownVisible, setEventDropdownVisible] = React.useState(false);

  const driverDropDownList = [
    { label: "Driver 1", value: "driver1" },
    { label: "Driver 2", value: "driver2" },
    { label: "Driver 3", value: "driver3" },
    { label: "Driver 4", value: "driver4" },
  ];

  const eventDropDownList = [
    { label: "Type 1", value: "type1" },
    { label: "Type 2", value: "type2" },
    { label: "Type 3", value: "type3" },
    { label: "Type 4", value: "type4" },
  ];

  const form = useFormik<IForm>({
    initialValues: {
      driver: "",
      date: "",
      description: "",
      eventType: "",
    },
    onSubmit: (values, helpers) => {
      setIsLoading(true);
      console.log(values);
      setTimeout(() => {
        setIsLoading(false);
        helpers.resetForm();
        ToastService.show("Activity added successfully");
        navigation.goBack();
      }, 1800);
    },
    validationSchema: scheme,
  });

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      date: moment(behaviorDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behaviorDate]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <View style={{ rowGap: theme.spacing.xs }}>
          <_Divider title="Activity Info" />
          <_DropDown
            theme={PaperTheme}
            dropDownItemTextStyle={{ ...gStyles.descText }}
            dropDownItemSelectedTextStyle={{
              ...gStyles.descTextPrimary,
            }}
            mode="outlined"
            label="Driver"
            value={form.values.driver}
            visible={driverDropdownVisible}
            showDropDown={() => setDriverDropdownVisible(true)}
            onDismiss={() => setDriverDropdownVisible(false)}
            setValue={(value) => {
              console.log(value);
              form.setValues((prev) => ({ ...prev, driver: value }));
            }}
            list={driverDropDownList}
          />
          <_TextInput
            value={form.values.date}
            label={"Behavior Date"}
            editable={false}
            onBlur={form.handleBlur("date")}
            onChangeText={form.handleChange("date")}
            error={form.errors?.date && form.touched?.date ? true : false}
            errorText={form.errors?.date}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowBehaviorDatePicker(true)}
              />
            }
          />
          <_DropDown
            theme={PaperTheme}
            dropDownItemTextStyle={{ ...gStyles.descText }}
            dropDownItemSelectedTextStyle={{
              ...gStyles.descTextPrimary,
            }}
            mode="outlined"
            label="Event Type"
            value={form.values.eventType}
            visible={eventDropdownVisible}
            showDropDown={() => setEventDropdownVisible(true)}
            onDismiss={() => setEventDropdownVisible(false)}
            setValue={(value) => {
              console.log(value);
              form.setValues((prev) => ({ ...prev, eventType: value }));
            }}
            list={eventDropDownList}
          />
          <_TextInput
            // multiline={true}
            numberOfLines={4}
            value={form.values.description}
            label={"Description"}
            onBlur={form.handleBlur("description")}
            onChangeText={form.handleChange("description")}
            error={
              form.errors?.description && form.touched?.description
                ? true
                : false
            }
            errorText={form.errors?.description}
          />
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              mode="contained"
              onPress={form.handleSubmit}
              labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
                color: colors.white,
              })}
            >
              {mode === "add" ? "Add" : "Update"}
            </Button>
          </View>
        </View>
      </_ScrollFormLayout>
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
      <_DatePicker
        show={showBehaviorDatePicker}
        setShow={setShowBehaviorDatePicker}
        mode={"date"}
        date={behaviorDate}
        setDate={setBehaviorDate}
      />
    </SafeAreaView>
  );
};

export { AddActivity };
