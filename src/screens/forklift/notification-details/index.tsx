import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { ForkliftStackScreenProps } from "@navigation-types";

interface OwnProps {}

const ForkliftNotificationDetails: React.FC<
  ForkliftStackScreenProps<"NotificationDetails">
> = ({}) => {
  return (
    <View>
      <Text>NotificationDetails</Text>
    </View>
  );
};

export { ForkliftNotificationDetails };
