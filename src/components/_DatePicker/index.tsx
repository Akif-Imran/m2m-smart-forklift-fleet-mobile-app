import { Modal, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { PaperTheme } from "../../theme";
import DateTimePicker from "@react-native-community/datetimepicker";

interface OwnProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "date" | "datetime" | "time";
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const _DatePicker: React.FC<OwnProps> = ({ show, setShow, mode, date, setDate }) => {
  //   const [show, setShow] = React.useState(false);

  const onChange = (event: any, selectedDate: any) => {
    if (Platform.OS !== "ios") setShow(false);
    const currentDate = selectedDate;
    setDate((prev) => currentDate);
  };
  return (
    <View>
      {Platform.OS === "ios" ? (
        <Modal
          visible={show}
          animationType="slide"
          style={{ marginHorizontal: 10, marginVertical: 15 }}
          presentationStyle="overFullScreen"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingVertical: 8,
              borderWidth: 0,
            }}
          >
            <Button theme={PaperTheme} mode="contained" onPress={() => setShow(false)}>
              Done
            </Button>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              display="spinner"
              //   is24Hour={true}
              onChange={onChange}
            />
          </View>
        </Modal>
      ) : (
        <>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              display="spinner"
              //   is24Hour={true}
              onChange={onChange}
            />
          )}
        </>
      )}
    </View>
  );
};

export { _DatePicker };

const styles = StyleSheet.create({});
