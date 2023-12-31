import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors, gStyles, theme } from "@theme";
import { useAuthContext } from "@context";

interface OwnProps {
  title: string;
  right?: { icon: React.ReactNode; onPress: () => void }[];
  left?: { icon: React.ReactNode; onPress: () => void }[];
}
const NoIconHeader: React.FC<OwnProps> = ({ title, right, left }) => {
  const { logout } = useAuthContext();

  return (
    <View style={styles.mainContainer}>
      <View
        style={StyleSheet.compose(styles.multiButtonContainer, {
          justifyContent: "flex-start",
        })}
      >
        {left ? (
          <>
            {left.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={item.onPress}
                style={styles.button}
                key={index}
              >
                {item.icon}
              </TouchableOpacity>
            ))}
          </>
        ) : null}
      </View>
      <View style={styles.titleContainer}>
        <Text style={gStyles.headerText}>{title}</Text>
      </View>
      <View style={styles.multiButtonContainer}>
        {right ? (
          <>
            {right.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={item.onPress}
                style={styles.button}
                key={index}
              >
                {item.icon}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => logout()}
            style={styles.button}
          >
            <Ionicons name="exit" size={25} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export { NoIconHeader };

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: theme.header.height,
    borderWidth: 0,
  },
  multiButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: theme.header.height,
    gap: theme.spacing.md,
    borderWidth: 0,
  },
  titleContainer: {
    flex: 4,
    borderWidth: 0,
  },
  button: {
    borderWidth: 0,
  },
});
