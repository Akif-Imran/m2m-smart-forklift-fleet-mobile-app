import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { DriverStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { listCardStyles, screenStyles } from "src/screens/styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { _AssignForkliftListCard } from "../components";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { Ionicons } from "@expo/vector-icons";
import { truncateText } from "@utility";
import { faker } from "@faker-js/faker";
import { Button, Checkbox } from "react-native-paper";
import { useFormik } from "formik";

interface IForm {
  tyreOk: boolean;
  bodyChange: boolean;
  bodyOk: boolean;
  breakOk: boolean;
}
const DriverCheckList: React.FC<DriverStackScreenProps<"DriverCheckList">> = ({ navigation }) => {
  const form = useFormik<IForm>({
    initialValues: {
      tyreOk: false,
      bodyChange: false,
      bodyOk: false,
      breakOk: false,
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      navigation.navigate("DriverTask");
    },
  });
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
                  source={{ uri: faker.image.urlPicsumPhotos() }}
                  resizeMode="cover"
                  style={listCardStyles.imgStyle}
                />
              </View>
              <View style={listCardStyles.infoWithForward}>
                <View style={listCardStyles.infoContainer}>
                  <Text style={gStyles.cardInfoTitleText}>PT-01</Text>
                  <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
                    John
                  </Text>
                  <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={0.5}>
                    AW56MFX
                  </Text>
                </View>
              </View>
            </View>
          </_DefaultCard>
          <_DefaultCard>
            <View
              // style={StyleSheet.compose(listCardStyles.contentContainer, {
              //   backgroundColor: colors.white,
              //   flexDirection: "column",
              // })}
              style={StyleSheet.compose(listCardStyles.reportListRecord, {
                borderBottomWidth: 0,
              })}
            >
              <View>
                <Text style={screenStyles.detailsCardHeadingText}>Check List</Text>
              </View>
              <View style={screenStyles.radioItemStyle}>
                <Checkbox.Item
                  label="Tyre Ok"
                  status={form.values.tyreOk ? "checked" : "unchecked"}
                  theme={PaperTheme}
                  color={colors.primary}
                  onPress={() => {
                    form.setValues((prev) => ({ ...prev, tyreOk: !prev.tyreOk }));
                  }}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <Checkbox.Item
                  label="Body Change"
                  status={form.values.bodyChange ? "checked" : "unchecked"}
                  theme={PaperTheme}
                  color={colors.primary}
                  onPress={() => {
                    form.setValues((prev) => ({ ...prev, bodyChange: !prev.bodyChange }));
                  }}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <Checkbox.Item
                  label="Body Ok"
                  status={form.values.bodyOk ? "checked" : "unchecked"}
                  theme={PaperTheme}
                  color={colors.primary}
                  onPress={() => {
                    form.setValues((prev) => ({ ...prev, bodyOk: !prev.bodyOk }));
                  }}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <Checkbox.Item
                  label="Break Ok"
                  status={form.values.breakOk ? "checked" : "unchecked"}
                  theme={PaperTheme}
                  color={colors.primary}
                  onPress={() => {
                    form.setValues((prev) => ({ ...prev, breakOk: !prev.breakOk }));
                  }}
                />
              </View>
            </View>
          </_DefaultCard>
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              mode="contained"
              onPress={() => form.handleSubmit()}
              labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
                color: colors.white,
              })}
            >
              submit
            </Button>
          </View>
        </View>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { DriverCheckList };
