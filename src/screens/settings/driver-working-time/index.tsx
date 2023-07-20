/* eslint-disable camelcase */
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  _DatePicker,
  _Divider,
  _DropDown,
  _ScrollFormLayout,
  _TextInput,
} from "@components";
import { screenStyles } from "@screen-styles";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import Spinner from "react-native-loading-spinner-overlay";
import { Platform, StyleSheet, View } from "react-native";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { addDriverWorkingTime, getDrivers } from "@services";
import { ToastService } from "@utility";
import { useAuthContext } from "@context";
import { useFormik } from "formik";
import moment from "moment";
import { Button, TextInput } from "react-native-paper";

interface IForm {
  driverId: string;
  startDateTime: string;
  endDateTime: string;
}

const DriverWorkingTime: React.FC<
  ProfileSettingsStackScreenProps<"DriverWorkingTime">
> = ({ navigation }) => {
  const {
    state: { token },
  } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [driverDropDownList, setDriverDropDownList] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [startMode, setStartMode] = React.useState<"date" | "time">("date");
  const [endMode, setEndMode] = React.useState<"date" | "time">("date");
  const [startDateTime, setStartDateTime] = React.useState<Date>(new Date());
  const [endDateTime, setEndDateTime] = React.useState<Date>(new Date());
  const [showStartDateTimePicker, setShowStartDateTimePicker] =
    React.useState(false);
  const [showEndDateTimePicker, setShowEndDateTimePicker] =
    React.useState(false);

  const [driverDropdownVisible, setDriverDropdownVisible] =
    React.useState(false);

  const form = useFormik<IForm>({
    initialValues: {
      driverId: "",
      startDateTime: moment().format("YYYY-MM-DD hh:mm A"),
      endDateTime: moment().format("YYYY-MM-DD hh:mm A"),
    },
    onSubmit: (values, helpers) => {
      setIsLoading(true);
      addDriverWorkingTime(token, {
        id: parseInt(values.driverId, 10),
        start_date_time: moment(startDateTime).utc().toJSON(),
        end_date_time: moment(endDateTime).utc().toJSON(),
      })
        .then((res) => {
          if (res?.message) {
            ToastService.show(res?.message);
          }
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
    },
  });

  const fetchDrivers = React.useCallback(() => {
    getDrivers(token)
      .then((res) => {
        if (res.success) {
          const list = res.data.rows.map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }));
          setDriverDropDownList(list);
        }
      })
      .catch((_err) => {
        ToastService.show("Something went wrong");
      });
  }, [token]);

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      startDateTime: moment(startDateTime).format("YYYY-MM-DD hh:mm A"),
    }));
    if (Platform.OS === "android" && startMode === "date") {
      setStartMode("time");
      setShowStartDateTimePicker(true);
    }
    if (Platform.OS === "android" && startMode === "time") {
      setStartMode("date");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDateTime]);
  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      endDateTime: moment(endDateTime).format("YYYY-MM-DD hh:mm A"),
    }));
    if (Platform.OS === "android" && startMode === "date") {
      setEndMode("time");
      setShowStartDateTimePicker(true);
    }
    if (Platform.OS === "android" && startMode === "time") {
      setEndMode("date");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDateTime]);

  React.useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout hasSpacing={true}>
        <View style={{ rowGap: theme.spacing.xs }}>
          <_Divider title="Driver Working Info" />
          <_DropDown
            theme={PaperTheme}
            dropDownItemTextStyle={{ ...gStyles.descText }}
            dropDownItemSelectedTextStyle={{
              ...gStyles.descTextPrimary,
            }}
            mode="outlined"
            label="Driver"
            value={form.values.driverId}
            visible={driverDropdownVisible}
            showDropDown={() => setDriverDropdownVisible(true)}
            onDismiss={() => setDriverDropdownVisible(false)}
            setValue={(value) => {
              console.log(value);
              form.setValues((prev) => ({ ...prev, driverId: value }));
            }}
            list={driverDropDownList}
          />
          <_TextInput
            value={form.values.startDateTime}
            label={"Start Date Time"}
            editable={false}
            onBlur={form.handleBlur("startDateTime")}
            onChangeText={form.handleChange("startDateTime")}
            error={
              form.errors?.startDateTime && form.touched?.startDateTime
                ? true
                : false
            }
            errorText={form.errors?.startDateTime}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowStartDateTimePicker(true)}
              />
            }
          />
          <_TextInput
            value={form.values.endDateTime}
            label={"End Date Time"}
            editable={false}
            onBlur={form.handleBlur("endDateTime")}
            onChangeText={form.handleChange("endDateTime")}
            error={
              form.errors?.endDateTime && form.touched?.endDateTime
                ? true
                : false
            }
            errorText={form.errors?.endDateTime}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowEndDateTimePicker(true)}
              />
            }
          />
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              mode="contained"
              onPress={() => form.handleSubmit()}
              labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
                color: colors.white,
              })}
            >
              Confirm
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
        show={showStartDateTimePicker}
        setShow={setShowStartDateTimePicker}
        mode={Platform.OS === "ios" ? "datetime" : startMode}
        date={startDateTime}
        setDate={setStartDateTime}
      />
      <_DatePicker
        show={showEndDateTimePicker}
        setShow={setShowEndDateTimePicker}
        mode={Platform.OS === "ios" ? "datetime" : endMode}
        date={endDateTime}
        setDate={setEndDateTime}
      />
    </SafeAreaView>
  );
};

export { DriverWorkingTime };
