import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { ForkliftStackScreenProps } from "@navigation-types";

interface OwnProps {}

const BirdEyeView: React.FC<ForkliftStackScreenProps<"BirdEyeView">> = ({ navigation, route }) => {
  return (
    <View>
      <Text>BirdEyeView</Text>
    </View>
  );
};

export { BirdEyeView };
