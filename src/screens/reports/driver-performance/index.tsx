import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  _DatePicker,
  _DefaultCard,
  _ListEmptyComponent,
  _TextInput,
} from "@components";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { listCardStyles, screenStyles } from "src/screens/styles";
import { theme, colors, PaperTheme, gStyles } from "@theme";
import moment from "moment";
import { ToastService } from "@utility";
import type { ReportStackScreenProps } from "@navigation-types";

const DriverPerformanceReport: React.FC<
  ReportStackScreenProps<"DriverPerformanceReport">
> = ({}) => {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
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
          onPress={() => ToastService.show("Demo")}
          labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
            color: colors.white,
          })}
        >
          Search
        </Button>
      </View>
      <_DefaultCard style={StyleSheet.compose(gStyles.card, { flex: 1 })}>
        <FlatList
          data={[1, 2, 3]}
          showsVerticalScrollIndicator={false}
          style={screenStyles.flatListStyle}
          ListEmptyComponent={<_ListEmptyComponent label="No Data..." />}
          renderItem={({}) => {
            return (
              <View style={listCardStyles.reportListRecord}>
                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Driver</Text>
                    <Text style={gStyles.tblDescText}>John</Text>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>No. of Collisions</Text>
                    <Text style={gStyles.tblDescText}>10</Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>
                      No. of OverSpeeding
                    </Text>
                    <Text style={gStyles.tblDescText}>10</Text>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>No. of Starts</Text>
                    <Text style={gStyles.tblDescText}>15</Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>No. of Stops</Text>
                    <Text style={gStyles.tblDescText}>10</Text>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    {/* <Text style={gStyles.tblHeaderText}>Location</Text>
                    <Text style={gStyles.tblDescText}>
                      {faker.location.latitude()},{faker.location.longitude()}
                    </Text> */}
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

export { DriverPerformanceReport };
