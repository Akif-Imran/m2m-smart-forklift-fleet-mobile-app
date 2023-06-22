import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import { gStyles } from "@theme";

interface OwnProps {
  label: string;
}

const _ListEmptyComponent: React.FC<OwnProps> = ({ label }) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  return (
    <View style={[styles.emptyListContainer, { height: SCREEN_HEIGHT / 2 }]}>
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
