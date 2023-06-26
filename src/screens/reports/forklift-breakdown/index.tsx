import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {}

const ForkliftBreakdownReport: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>ForkliftBreakdownReport</Text>
    </View>
  );
};

export { ForkliftBreakdownReport};
