import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { CustomerStackScreenProps } from "@navigation-types";

import { styles } from "./styles";

interface OwnProps {}

const CustomerList: React.FC<CustomerStackScreenProps<"CustomerList">> = ({
  navigation,
  route,
}) => {
  return (
    <View>
      <Text>CustomerList</Text>
    </View>
  );
};

export { CustomerList };
