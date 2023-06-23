import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { _DefaultCard } from "@components";
import { useNavigation } from "@react-navigation/native";
import { ForkliftStackScreenProps } from "@navigation-types";

interface OwnProps {
  item: INotification;
  handleDelete: (notificationId: string) => void;
}

const _NotificationListCard: React.FC<OwnProps> = ({ handleDelete, item }) => {
  const navigation = useNavigation<ForkliftStackScreenProps<"Notification">["navigation"]>();

  return (
    <_DefaultCard
      onLongPress={() => handleDelete(item._id)}
      onPress={() =>
        navigation.navigate("NotificationDetails", {
          item: item,
          _id: item._id,
        })
      }
    >
      <Text>_NotificationListCard</Text>
    </_DefaultCard>
  );
};

export { _NotificationListCard };
