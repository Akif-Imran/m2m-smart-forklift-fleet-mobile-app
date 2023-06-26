import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {}

const AddService: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>AddServices</Text>
    </View>
  );
};

export { AddService };
