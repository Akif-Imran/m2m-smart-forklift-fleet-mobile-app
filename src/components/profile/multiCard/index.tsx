/* eslint-disable react-native/no-inline-styles */
import { Text, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-paper";
import type { FC } from "react";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PaperTheme, colors } from "@theme";
import { availableStatusToggle } from "@services";
import { ToastService } from "@utility";
import { useAuthContext } from "@context";

import { styles } from "./styles";

interface MultiCardProps {
  data: Item[];
}
export interface Item {
  id: number;
  icon: React.ReactNode;
  bgColor: string;
  title: string;
  color: string;
  onPress: () => void;
}
const MultiCard: FC<MultiCardProps> = ({ data }) => {
  const {
    dispatch,
    state: { token, user },
  } = useAuthContext();
  const [isEnabled, setIsEnabled] = useState(user?.available_status || false);
  const toggleSwitch = (value: boolean) => {
    //call api here
    availableStatusToggle(token, value ? 1 : 0)
      .then((res) => {
        ToastService.show(res?.message);
        if (res.success) {
          setIsEnabled(value);
          dispatch({
            type: "TOGGLE_DRIVER_AVAILABLE_STATUS",
            payload: { value },
          });
        }
      })
      .catch((err) => {
        console.log(err?.message);
        ToastService.show("An error occurred");
      });
  };
  return (
    <View style={styles.mainContainer}>
      {/* <FlatList
        data={data}
        renderItem={({ item }, index: number) => (
          <View
            style={[
              styles.cardContainer,
              index === data.length - 1 ? { borderBottomWidth: 0 } : null,
            ]}
          >
            <View style={styles.iconContainer}>
              <View
                style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}
              >
                {item.icon}
              </View>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.headerText}>{item.title}</Text>
            </View>
            <View style={styles.forwardContainer}>
              <MaterialIcons
                name="keyboard-arrow-right"
                color={theme.textGray}
                size={20}
              />
            </View>
          </View>
        )}
      /> */}
      {data.map((item, index: number) => (
        <TouchableOpacity
          style={[
            styles.cardContainer,
            index === data.length - 1 ? { borderBottomWidth: 0 } : null,
          ]}
          activeOpacity={0.7}
          key={index}
          onPress={item.title === "Available" ? undefined : item.onPress}
        >
          <View style={styles.iconContainer}>
            <View
              style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}
            >
              {item.icon}
            </View>
          </View>
          <View style={styles.dataContainer}>
            <Text style={[styles.headerText, { color: item.color }]}>
              {item.title}
            </Text>
            {item.title === "Available" ? (
              <Switch
                theme={PaperTheme}
                trackColor={{ false: colors.heavyGray, true: colors.primary }}
                thumbColor={"#f4f3f4"}
                onValueChange={(value) => toggleSwitch(value)}
                value={isEnabled}
              />
            ) : null}
          </View>
          {item.title !== "Available" && (
            <View style={styles.forwardContainer}>
              <MaterialIcons
                name="keyboard-arrow-right"
                color={colors.textGray}
                size={20}
              />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export { MultiCard };
