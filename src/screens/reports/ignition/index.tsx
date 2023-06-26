import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {}

const IgnitionReport: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>IgnitionReport</Text>
    </View>
  );
};

export { IgnitionReport };
