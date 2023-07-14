/* eslint-disable camelcase */
import { StyleSheet, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
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
import { addDriverBehavior, getDrivers, getEventTypes } from "@services";
import { useAuthContext } from "@context";
import { getBehaviorEventTypes } from "src/services/drivers";

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
  const {
    state: { token },
  } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [driverDropDownList, setDriverDropDownList] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [eventDropDownList, setEventDropDownList] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [behaviorDate, setBehaviorDate] = React.useState<Date>(new Date());
  const [showBehaviorDatePicker, setShowBehaviorDatePicker] =
    React.useState(false);

  const [driverDropdownVisible, setDriverDropdownVisible] =
    React.useState(false);
  const [eventDropdownVisible, setEventDropdownVisible] = React.useState(false);

  // const driverDropDownList = [
  //   { label: "Driver 1", value: "driver1" },
  //   { label: "Driver 2", value: "driver2" },
  //   { label: "Driver 3", value: "driver3" },
  //   { label: "Driver 4", value: "driver4" },
  // ];

  // const eventDropDownList = [
  //   { label: "Type 1", value: "type1" },
  //   { label: "Type 2", value: "type2" },
  //   { label: "Type 3", value: "type3" },
  //   { label: "Type 4", value: "type4" },
  // ];

  const form = useFormik<IForm>({
    initialValues: {
      driver: "",
      date: "",
      description: "",
      eventType: "",
    },
    onSubmit: (values, helpers) => {
      setIsLoading(true);
      addDriverBehavior(token, {
        driver_id: parseInt(values.driver, 10),
        behavior_date: values.date,
        description: values.description,
        //FIXME - get event type and add them to list
        event_type_id: parseInt(values.eventType, 10),
      })
        .then((res) => {
          ToastService.show(res?.message || "");
          if (res.success) {
            helpers.resetForm();
            navigation.goBack();
          }
        })
        .catch((_err) => {
          ToastService.show("Error occurred");
          console.log(_err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    validationSchema: scheme,
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

  const fetchEventTypes = React.useCallback(() => {
    getBehaviorEventTypes(token)
      .then((res) => {
        if (res.success) {
          const list = res.data.map((value) => ({
            label: value.id.toString(),
            value: value.id.toString(),
          }));
          //FIXME - remove this self added record
          list.push({ label: "Type 01", value: "1" });
          setEventDropDownList(list);
        }
      })
      .catch((_err) => {
        ToastService.show("Event Type Error");
      });
  }, [token]);

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      date: moment(behaviorDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behaviorDate]);

  React.useEffect(() => {
    fetchDrivers();
    fetchEventTypes();
  }, [fetchDrivers, fetchEventTypes]);

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
