import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {}

const OverSpeedingReport: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>OverSpeedingReport</Text>
    </View>
  );
};

export { OverSpeedingReport };
