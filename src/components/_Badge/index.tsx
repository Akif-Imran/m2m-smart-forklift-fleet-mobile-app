import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";

type Props = {
  status: "online" | "offline";
};

export const _Badge: React.FC<Props> = ({ status }) => {
  return (
    <View style={styles.mainContainer}>
      <View
        style={[
          styles.dot,
          status === "online" ? styles.online : styles.offline,
        ]}
      />
      <Text
        style={[
          styles.statusText,
          status === "online" ? styles.onlineText : styles.offlineText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
};
