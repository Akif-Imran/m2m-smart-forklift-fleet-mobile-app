import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  _DatePicker,
  _DefaultCard,
  _ListEmptyComponent,
  _TextInput,
} from "@components";
import { Button, TextInput } from "react-native-paper";
import { theme, colors, PaperTheme, gStyles } from "@theme";
import moment from "moment";
import { listCardStyles, screenStyles } from "@screen-styles";
import {
  CALC_FORMAT_DURATION_HH_MM_SS,
  FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_SS_12,
  ToastService,
} from "@utility";
import type { ReportStackScreenProps } from "@navigation-types";
import { getUtilizationReport } from "@services";
import { useAuthContext } from "@context";
import { useAppSelector } from "@store";
import Spinner from "react-native-loading-spinner-overlay";

const ForkliftUtilizationReport: React.FC<
  ReportStackScreenProps<"ForkliftUtilizationReport">
> = ({ route }) => {
  const { vehicleId } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const vehicle = useAppSelector((state) =>
    state.vehicles.data.rows.find((veh) => veh.id === vehicleId)
  );
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [records, setRecords] = React.useState<IUtilizationReport[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSearch = () => {
    if (!vehicleId) {
      ToastService.show("Invalid vehicle Id");
      return;
    }
    fetchUtilizationReport(startDate, endDate, `${vehicleId}`);
  };

  const fetchUtilizationReport = React.useCallback(
    (start: Date, end: Date, id: string) => {
      setIsLoading(true);
      getUtilizationReport(token, {
        startDate: moment(start).format("YYYY-MM-DD"),
        endDate: moment(end).format("YYYY-MM-DD"),
        vehicleId: id,
      })
        .then((res) => {
          if (res.success) {
            setRecords(res.result);
          }
        })
        .catch(() => {
          ToastService.show("Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [token]
  );

  React.useEffect(() => {
    if (!vehicleId) {
      return;
    }
    fetchUtilizationReport(startDate, endDate, `${vehicleId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUtilizationReport, vehicleId]);

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
                    <Text style={gStyles.tblHeaderText}>Duration</Text>
                    <Text style={gStyles.tblDescText}>
                      {CALC_FORMAT_DURATION_HH_MM_SS(
                        item.start_time,
                        item.end_time
                      )}
                    </Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Start Date/Time</Text>
                    <Text style={gStyles.tblDescText}>
                      {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_SS_12(
                        item.start_time
                      )}
                    </Text>
                  </View>

                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>End Date/Time</Text>
                    <Text style={gStyles.tblDescText}>
                      {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_SS_12(item.end_time)}
                    </Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Driver</Text>
                    <Text style={gStyles.tblDescText}>{item.driver_name}</Text>
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

export { ForkliftUtilizationReport };
