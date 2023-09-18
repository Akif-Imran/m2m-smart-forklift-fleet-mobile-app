/* eslint-disable react-hooks/exhaustive-deps */
import { BackHandler, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { listCardStyles, screenStyles } from "@screen-styles";
import { PaperTheme, colors, gStyles } from "@theme";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { Button, Checkbox } from "react-native-paper";
import { useFormik } from "formik";
import { getCheckList } from "@services";
import { useAuthContext, useTaskContext } from "@context";
import { BASE_URL } from "@api";
import { ToastService } from "@utility";

import { _AssignForkliftListCard } from "../components";

interface IForm {
  ids: number[];
  checkList: string[];
  // tyreOk: boolean;
  // bodyChange: boolean;
  // bodyOk: boolean;
  // breakOk: boolean;
}
const DriverCheckList: React.FC<
  ForkliftStackScreenProps<"DriverCheckList">
> = ({ navigation, route }) => {
  const { item } = route.params;
  console.log("check list", item);
  const {
    state: { token, user },
  } = useAuthContext();
  const {
    startTask,
    state: { inProgress },
  } = useTaskContext();
  const [checkList, setCheckList] = React.useState<IChecklist[]>([]);
  const form = useFormik<IForm>({
    initialValues: {
      ids: [],
      checkList: [],
      // tyreOk: false,
      // bodyChange: false,
      // bodyOk: false,
      // breakOk: false,
    },
    onSubmit: (values, _helpers) => {
      console.log(values);
      startTask(values.checkList.join(", "), item.vehicle_id);
    },
  });

  const toggleString = (str: string) => {
    const stringArray = [...form.values.checkList];
    if (stringArray.includes(str)) {
      // String exists in array, so remove it
      const index = stringArray.indexOf(str);
      stringArray.splice(index, 1);
    } else {
      // String doesn't exist in array, so add it
      stringArray.push(str);
    }
    return stringArray;
  };

  const toggleNumber = (num: number) => {
    const numberArray = [...form.values.ids];
    if (numberArray.includes(num)) {
      // Number exists in array, so remove it
      const index = numberArray.indexOf(num);
      numberArray.splice(index, 1);
    } else {
      // Number doesn't exist in array, so add it
      numberArray.push(num);
    }
    return numberArray;
  };

  React.useEffect(() => {
    if (!token) {
      return;
    }
    getCheckList(token)
      .then((res) => {
        if (res.success) {
          setCheckList(res.data);
        }
      })
      .catch(() => {
        ToastService.show("An error occurred");
      });
  }, [token]);

  React.useEffect(() => {
    if (!inProgress) {
      return;
    }
    navigation.navigate("DriverTask");
  }, [inProgress]);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.popToTop();
        return true;
      }
    );
    return () => {
      backHandler.remove();
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
                {user?.profile_picture ? (
                  <Image
                    source={{ uri: `${BASE_URL}${user.profile_picture}` }}
                    resizeMode="cover"
                    style={listCardStyles.imgStyle}
                  />
                ) : (
                  <View
                    style={StyleSheet.compose(
                      screenStyles.imgStyle,
                      screenStyles.noImage
                    )}
                  >
                    <Text style={gStyles.cardInfoTitleText}>No Image</Text>
                  </View>
                )}
              </View>
              <View style={listCardStyles.infoWithForward}>
                <View style={listCardStyles.infoContainer}>
                  <Text style={gStyles.cardInfoTitleText}>
                    {item.device_name}
                  </Text>
                  <Text
                    style={gStyles.tblDescText}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {user?.name}
                  </Text>
                  <Text
                    style={gStyles.tblDescText}
                    ellipsizeMode="tail"
                    numberOfLines={0.5}
                  >
                    {item.IMEI}
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
                paddingHorizontal: 0,
                paddingVertical: 0,
              })}
            >
              <View>
                <Text style={screenStyles.detailsCardHeadingText}>
                  Check List
                </Text>
              </View>
              {checkList.map((listItem) => {
                console.log(form.values.ids);
                return (
                  <View key={listItem.id}>
                    <Checkbox.Item
                      label={listItem.name}
                      labelStyle={gStyles.tblDescText}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{ height: 32 }}
                      status={
                        form.values.ids.includes(listItem.id)
                          ? "checked"
                          : "unchecked"
                      }
                      theme={PaperTheme}
                      color={colors.primary}
                      onPress={() => {
                        const numbers = toggleNumber(listItem.id);
                        const strs = toggleString(listItem.name);
                        form.setValues((prev) => ({
                          ...prev,
                          ids: numbers,
                          checkList: strs,
                        }));
                      }}
                    />
                  </View>
                );
              })}
              {/* <View style={screenStyles.radioItemStyle}>
                <Checkbox.Item
                  label="Body Change"
                  status={form.values.bodyChange ? "checked" : "unchecked"}
                  theme={PaperTheme}
                  color={colors.primary}
                  onPress={() => {
                    form.setValues((prev) => ({
                      ...prev,
                      bodyChange: !prev.bodyChange,
                    }));
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
                    form.setValues((prev) => ({
                      ...prev,
                      bodyOk: !prev.bodyOk,
                    }));
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
                    form.setValues((prev) => ({
                      ...prev,
                      breakOk: !prev.breakOk,
                    }));
                  }}
                />
              </View> */}
            </View>
          </_DefaultCard>
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ flex: 1 }}
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
