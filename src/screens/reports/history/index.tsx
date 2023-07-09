import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
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
import { FontAwesome5 } from "@expo/vector-icons";
import { faker } from "@faker-js/faker";
import { ToastService } from "@utility";
import type { ReportStackScreenProps } from "@navigation-types";

const HistoryReport: React.FC<ReportStackScreenProps<"HistoryReport">> = ({
  navigation,
}) => {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const [vehicleDropdownVisible, setVehicleDropdownVisible] =
    React.useState(false);
  const [value, setValue] = React.useState("all");

  const vehicleDropDownList = [
    { label: "All", value: "all" },
    { label: "PT-01", value: "pt-01" },
    { label: "PT-02", value: "pt-02" },
    { label: "PT-03", value: "pt-03" },
    { label: "PT-04", value: "pt-04" },
  ];

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <View>
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
      </View>
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
                    <Text style={gStyles.tblHeaderText}>Forklift</Text>
                    <Text style={gStyles.tblDescText}>PT-01</Text>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate("ViewOnMap", {
                          location: {
                            latitude: 3.139003,
                            longitude: 101.686855,
                          },
                          name: "PT-01",
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

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Date/Time</Text>
                    <Text style={gStyles.tblDescText}>
                      {moment(faker.date.past()).format(
                        "DD MMM, YYYY hh:mm:ss A"
                      )}
                    </Text>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    <Text style={gStyles.tblHeaderText}>Speed</Text>
                    <Text style={gStyles.tblDescText}>12 Km/h</Text>
                  </View>
                </View>

                <View style={listCardStyles.reportRecordRow}>
                  <View style={listCardStyles.reportRecordRowItemLeft}>
                    <Text style={gStyles.tblHeaderText}>Positioning</Text>
                    <Text style={gStyles.tblDescText}>
                      {faker.location.direction()}
                    </Text>
                  </View>
                  <View style={listCardStyles.reportRecordRowItemRight}>
                    {/* <Text style={gStyles.tblHeaderText}>Speed</Text>
                    <Text style={gStyles.tblDescText}>12 Km/h</Text> */}
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

export { HistoryReport };
