import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {}

const IdlingReport: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>IdlingReport</Text>
    </View>
  );
};

export { IdlingReport};
