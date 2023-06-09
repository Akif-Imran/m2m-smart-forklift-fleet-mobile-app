import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { colors, gStyles } from "../../theme";
import { useAuthContext } from "@context";

interface OwnProps {
  title: string;
}
const NoIconHeader: React.FC<OwnProps> = ({ title }) => {
  const { logout } = useAuthContext();
  return (
    <View style={styles.mainContainer}>
      <View style={{ width: 25, height: 25, borderWidth: 0 }}>
        {/* <MaterialCommunityIcons name="bell" size={25} color={colors.primary} /> */}
      </View>
      <View style={{ flex: 1, borderWidth: 0 }}>
        <Text style={gStyles.headerText}>{title}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => logout()} style={{ borderWidth: 0 }}>
        <Ionicons name="exit" size={25} color={colors.primary} />
      </TouchableOpacity>
      {/* <Text>Header</Text> */}
    </View>
  );
};

export { NoIconHeader };

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    // width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // height: 40,
    paddingTop: 15,
    // borderWidth: 1,
  },
});
