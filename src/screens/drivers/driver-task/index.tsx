import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import type { DriverStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { listCardStyles, screenStyles } from "src/screens/styles";
import { PaperTheme, colors, gStyles } from "@theme";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { FORMAT_DURATION_HH_MM_SS, ToastService } from "@utility";
import { faker } from "@faker-js/faker";
import { Button } from "react-native-paper";
import moment from "moment";

const DriverTask: React.FC<DriverStackScreenProps<"DriverTask">> = ({}) => {
  const [durationInSeconds, setDurationInSeconds] = React.useState(0);
  const [image, _setImage] = React.useState<string>(
    faker.image.urlPicsumPhotos()
  );
  const [date, _setDate] = React.useState<string>(faker.date.past().toString());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDurationInSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <View>
          <_DefaultCard>
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
          </_DefaultCard>
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
              onPress={() => {
                ToastService.show("demo");
              }}
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
