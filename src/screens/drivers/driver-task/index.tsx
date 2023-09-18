import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, gStyles } from "@theme";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { FORMAT_DURATION_HH_MM_SS } from "@utility";
import { Button } from "react-native-paper";
import moment from "moment";
import { useTaskContext } from "@context";
import Spinner from "react-native-loading-spinner-overlay";

const DriverTask: React.FC<ForkliftStackScreenProps<"DriverTask">> = ({
  navigation,
}) => {
  const {
    state: { isLoading, task },
    endTasks,
  } = useTaskContext();
  const [durationInSeconds, setDurationInSeconds] = React.useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    if (!task) {
      return;
    }
    const duration = moment().diff(task.start_time, "seconds");
    setDurationInSeconds(duration);
    intervalRef.current = setInterval(() => {
      setDurationInSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(intervalRef?.current);
    };
  }, [task]);

  const endJob = () => {
    clearInterval(intervalRef?.current);
    endTasks();
    navigation.reset({
      index: 1,
      routes: [{ name: "Forklift" }, { name: "DriverTask" }],
      type: "stack",
    });
  };

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
      <_ScrollFormLayout>
        <View>
          {/* <_DefaultCard>
            <View
              style={StyleSheet.compose(listCardStyles.contentContainer, {
                backgroundColor: colors.white,
              })}
            >
              <View>
                <Image
                  source={{ uri: image }}
                  resizeMode="cover"
                  style={listCardStyles.imgStyle}
                />
              </View>
              <View style={listCardStyles.infoWithForward}>
                <View style={listCardStyles.infoContainer}>
                  <Text style={gStyles.cardInfoTitleText}>PT-01</Text>
                  <Text
                    style={gStyles.tblDescText}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    John
                  </Text>
                  <Text
                    style={gStyles.tblDescText}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {moment(date).format("MMM D, YYYY hh:mm:ss A")}
                  </Text>
                  <Text
                    style={gStyles.tblDescText}
                    ellipsizeMode="tail"
                    numberOfLines={0.5}
                  >
                    AW56MFX
                  </Text>
                </View>
              </View>
            </View>
          </_DefaultCard> */}
          <_DefaultCard>
            <View>
              <Text style={gStyles.headerText}>
                {FORMAT_DURATION_HH_MM_SS(durationInSeconds)}
              </Text>
            </View>
          </_DefaultCard>
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              mode="contained"
              color={colors.error}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ flex: 1 }}
              onPress={endJob}
              labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
                color: colors.white,
              })}
            >
              End Job
            </Button>
          </View>
        </View>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { DriverTask };
