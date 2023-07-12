import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import { gStyles } from "@theme";

interface OwnProps {
  label: string;
  coversSpace?: boolean;
}

const _ListEmptyComponent: React.FC<OwnProps> = ({
  label,
  coversSpace = true,
}) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  return (
    <View
      style={[
        styles.emptyListContainer,
        coversSpace && { height: SCREEN_HEIGHT / 2 },
      ]}
    >
      <Text style={gStyles.cardTitleText}>{label}</Text>
    </View>
  );
};

export { _ListEmptyComponent };

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
  },
});
