import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { _DefaultCard } from "@components";
import { useNavigation } from "@react-navigation/native";
import { ServiceStackScreenProps } from "@navigation-types";

interface OwnProps {
  item: IService;
  handleDelete: (serviceId: string) => void;
}

const _ServiceListCard: React.FC<OwnProps> = ({ handleDelete, item }) => {
  const navigation = useNavigation<ServiceStackScreenProps<"Services">["navigation"]>();
  return (
    <_DefaultCard
      onLongPress={() => handleDelete(item._id)}
      onPress={() =>
        navigation.navigate("ServiceDetails", {
          _id: item._id,
          item: item,
        })
      }
    >
      <Text>{item.date}</Text>
    </_DefaultCard>
  );
};

export { _ServiceListCard };
