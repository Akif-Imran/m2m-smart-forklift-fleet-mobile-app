import { Text, View } from "react-native";
import React from "react";

interface OwnProps {
  data: {
    icon: string;
  };
}
const TimelineIcon: React.FC<OwnProps> = ({ data }) => {
  console.log("icon component", data);
  return (
    <View>
      <Text>{data.icon}</Text>
    </View>
  );
};

export { TimelineIcon };
