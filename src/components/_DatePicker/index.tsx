import { Modal, Platform, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { PaperTheme } from "@theme";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { styles } from "./styles";

interface OwnProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "date" | "datetime" | "time";
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const _DatePicker: React.FC<OwnProps> = ({
  show,
  setShow,
  mode,
  date,
  setDate,
}) => {
  //   const [show, setShow] = React.useState(false);

  const onChange = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (Platform.OS !== "ios") {
      setShow(false);
    }
    const currentDate = selectedDate;
    if (!currentDate) {
      return;
    }
    setDate(currentDate);
  };
  return (
    <View>
      {Platform.OS === "ios" ? (
        <Modal
          visible={show}
          animationType="slide"
          style={styles.modalStyle}
          presentationStyle="overFullScreen"
        >
          <View style={styles.contentStyle}>
            <Button
              theme={PaperTheme}
              mode="contained"
              onPress={() => setShow(false)}
            >
              Done
            </Button>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              display="spinner"
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
              onChange={onChange}
            />
          )}
        </>
      )}
    </View>
  );
};

export { _DatePicker };
