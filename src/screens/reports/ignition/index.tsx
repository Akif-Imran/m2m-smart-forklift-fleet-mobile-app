import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  _TextInput,
  _DatePicker,
  _DefaultCard,
  _ListEmptyComponent,
  _DropDown,
} from "@components";
import { theme, colors, PaperTheme, gStyles } from "@theme";
import moment from "moment";
import { listCardStyles, screenStyles } from "@screen-styles";
import { ToastService } from "@utility";
import type { ReportStackScreenProps } from "@navigation-types";
import { useAuthContext } from "@context";
import { useAppSelector } from "@store";
import { getIgnitionReport } from "@services";
import Spinner from "react-native-loading-spinner-overlay";

const IgnitionReport: React.FC<ReportStackScreenProps<"IgnitionReport">> = ({
  route,
  navigation,
}) => {
  const { deviceId } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const device = useAppSelector((state) =>
    state.devices.data.rows.find((dev) => dev.id === deviceId)
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [records, setRecords] = React.useState<IIgnitionReport[]>([]);

  // const [vehicleDropdownVisible, setVehicleDropdownVisible] =
  //   React.useState(false);
  // const [value, setValue] = React.useState("all");

  // const vehicleDropDownList = [
  //   { label: "All", value: "all" },
  //   { label: "PT-01", value: "pt-01" },
  //   { label: "PT-02", value: "pt-02" },
  //   { label: "PT-03", value: "pt-03" },
  //   { label: "PT-04", value: "pt-04" },
  // ];

  const fetchIgnitionReport = (start: Date, end: Date, IMEI: string) => {
    setIsLoading(true);
    const startDateString = moment(start).format("YYYY-MM-DD");
    const endDateString = moment(end).format("YYYY-MM-DD");
    getIgnitionReport(token, {
      IMEI,
      startDate: startDateString,
      endDate: endDateString,
    })
      .then((res) => {
        if (res.success) {
          setRecords(res.result);
        }
      })
      .catch((err) => {
        console.log(err?.message);
        ToastService.show("An error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    if (!device) {
      ToastService.show("Device not found");
      navigation.goBack();
      return;
    }
    fetchIgnitionReport(startDate, endDate, device?.IMEI);
  };

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
      <View style={{ height: theme.header.height }} />
      {/* <View>
        <_DropDown
          theme={PaperTheme}
          dropDownItemTextStyle={{ ...gStyles.descText }}
          dropDownItemSelectedTextStyle={{
            ...gStyles.descTextPrimary,
          }}
          mode="outlined"
          label="Vehicle"
          placeholder="Select Vehicle"
          value={value}
          visible={vehicleDropdownVisible}
          showDropDown={() => setVehicleDropdownVisible(true)}
          onDismiss={() => setVehicleDropdownVisible(false)}
          setValue={setValue}
          list={vehicleDropDownList}
        />
      </View> */}
      <View style={screenStyles.reportDateInputPickerContainer}>
        <_TextInput
          value={moment(startDate).format("DD MMM, YYYY")}
          label={"Start Date"}
          editable={false}
          errorText={undefined}
          right={
            <TextInput.Icon
              icon="calendar"
              color={colors.iconGray}
              onPress={() => setShow(true)}
            />
          }
        />
        <_TextInput
          value={moment(endDate).format("DD MMM, YYYY")}
          label={"End Date"}
          editable={false}
          errorText={undefined}
          right={
            <TextInput.Icon
              icon="calendar"
              color={colors.iconGray}
              onPress={() => setShow2(true)}
            />
          }
        />
      </View>
      <View style={screenStyles.formSubmitButtonContainer}>
        <Button
          theme={PaperTheme}
          mode="contained"
          onPress={() => handleSearch()}
          labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
            color: colors.white,
          })}
        >
          Search
        </Button>
      </View>
      <_DefaultCard style={StyleSheet.compose(gStyles.card, { flex: 1 })}>
        <FlatList
          data={records}
          showsVerticalScrollIndicator={false}
          style={screenStyles.flatListStyle}
          ListEmptyComponent={<_ListEmptyComponent label="No Data..." />}
          renderItem={({ item }) => {
            return (
              <View style={listCardStyles.reportListRecord}>
                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Forklift</Text>
                    <Text style={gStyles.tblDescText}>PT-01</Text>
                  </View>
                </View>
                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>Event</Text>
                    <Text style={gStyles.tblDescText}>{"Ignition ON"}</Text>
                  </View>

                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Date/Time</Text>
                    <Text style={gStyles.tblDescText}>
                      {moment(item.gps_start_time).format(
                        "DD MMM, YYYY hh:mm:ss A"
                      )}
                    </Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>Event</Text>
                    <Text style={gStyles.tblDescText}>{"Ignition OFF"}</Text>
                  </View>

                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Date/Time</Text>
                    <Text style={gStyles.tblDescText}>
                      {moment(item.gps_end_time).format(
                        "DD MMM, YYYY hh:mm:ss A"
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      </_DefaultCard>
      <_DatePicker
        show={show}
        setShow={setShow}
        date={startDate}
        setDate={setStartDate}
        mode={"date"}
      />
      <_DatePicker
        show={show2}
        setShow={setShow2}
        date={endDate}
        setDate={setEndDate}
        mode={"date"}
      />
    </SafeAreaView>
  );
};

export { IgnitionReport };
