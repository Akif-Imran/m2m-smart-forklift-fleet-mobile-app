import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuthContext } from "@context";
import { getIdlingReport } from "@services";
import { defaultLocation } from "@constants";
import { Button, TextInput } from "react-native-paper";
import { listCardStyles, screenStyles } from "@screen-styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { selectVehiclesWithDevices, useAppSelector } from "@store";
import type { ReportStackScreenProps } from "@navigation-types";
import Spinner from "react-native-loading-spinner-overlay";
import {
  CALC_FORMAT_DURATION_HH_MM_SS,
  FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_SS_12,
  ToastService,
} from "@utility";
import {
  _TextInput,
  _DatePicker,
  _DefaultCard,
  _ListEmptyComponent,
  _DropDown,
} from "@components";

const IdlingReport: React.FC<ReportStackScreenProps<"IdlingReport">> = ({
  navigation,
  route,
}) => {
  const { deviceId } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const { data: vehicles } = useAppSelector(selectVehiclesWithDevices);
  const vehicle = vehicles.find((veh) => veh.device?.id === deviceId);
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [records, setRecords] = React.useState<IIdlingReport[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSearch = () => {
    if (!vehicle?.device?.IMEI) {
      ToastService.show("No such device found");
      return;
    }
    fetchIdlingReport(startDate, endDate, vehicle?.device?.IMEI);
  };

  const fetchIdlingReport = React.useCallback(
    (start: Date, end: Date, IMEI: string) => {
      setIsLoading(true);
      getIdlingReport(token, {
        IMEI,
        startDate: moment(start).format("YYYY-MM-DD"),
        endDate: moment(end).format("YYYY-MM-DD"),
      })
        .then((res) => {
          if (res?.success) {
            setRecords(res.result);
          }
        })
        .catch((_err) => {
          ToastService.show("Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [token]
  );

  React.useEffect(() => {
    if (!vehicle?.device?.IMEI) {
      return;
    }
    fetchIdlingReport(startDate, endDate, vehicle?.device?.IMEI);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchIdlingReport, vehicle]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <Spinner
        animation="fade"
        cancelable={false}
        visible={isLoading}
        size={"large"}
      />

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
                    <Text style={gStyles.tblDescText}>{vehicle?.reg_no}</Text>
                  </View>

                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>Idling Duration</Text>
                    <Text style={gStyles.tblDescText}>
                      {CALC_FORMAT_DURATION_HH_MM_SS(
                        item.gps_start_time,
                        item.gps_end_time
                      )}
                    </Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Start Date/Time</Text>
                    <Text style={gStyles.tblDescText}>
                      {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_SS_12(
                        item.gps_start_time
                      )}
                    </Text>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>End Date/Time</Text>
                    <Text style={gStyles.tblDescText}>
                      {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_SS_12(
                        item.gps_end_time
                      )}
                    </Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>
                      {" "}
                      Ignition On Location
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate("ViewOnMap", {
                          location: {
                            latitude: item.start_latitude
                              ? parseFloat(item.start_latitude)
                              : defaultLocation.latitude,
                            longitude: item.start_longitude
                              ? parseFloat(item.start_longitude)
                              : defaultLocation.longitude,
                          },
                          name: vehicle?.reg_no || "N/A",
                        })
                      }
                    >
                      <FontAwesome5
                        name="map-marked-alt"
                        size={24}
                        color={colors.iconGray}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>
                      Ignition Off Location
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate("ViewOnMap", {
                          location: {
                            latitude: item.end_latitude
                              ? parseFloat(item.end_latitude)
                              : defaultLocation.latitude,
                            longitude: item.end_longitude
                              ? parseFloat(item.end_longitude)
                              : defaultLocation.longitude,
                          },
                          name: vehicle?.reg_no || "N/A",
                        })
                      }
                    >
                      <FontAwesome5
                        name="map-marked-alt"
                        size={24}
                        color={colors.iconGray}
                      />
                    </TouchableOpacity>
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

export { IdlingReport };
