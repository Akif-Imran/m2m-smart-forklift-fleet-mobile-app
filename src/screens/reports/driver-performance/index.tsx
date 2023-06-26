import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {}

const DriverPerformanceReport: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>DriverPerformanceReport</Text>
    </View>
  );
};

export { DriverPerformanceReport };
