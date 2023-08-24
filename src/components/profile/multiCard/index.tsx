/* eslint-disable react-native/no-inline-styles */
import { Text, TouchableOpacity, View, Switch } from "react-native";
import type { FC } from "react";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@theme";

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
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
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
          onPress={item.onPress}
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
            {item.title === "Notifications" ? (
              <Switch
                trackColor={{ false: colors.heavyGray, true: colors.primary }}
                thumbColor={"#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            ) : null}
          </View>
          <View style={styles.forwardContainer}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={colors.textGray}
              size={20}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export { MultiCard };
