import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {}

const ForkliftUtilizationReport: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>ForkliftUtilizationReport</Text>
    </View>
  );
};

export { ForkliftUtilizationReport };
