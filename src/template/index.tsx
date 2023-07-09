import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {
  navigation: unknown;
}

const _Component: React.FC<OwnProps> = ({}) => {
  return (
    <View>
      <Text style={styles.placeholder}>_Component</Text>
    </View>
  );
};

export { _Component };
