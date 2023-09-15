import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colors, theme } from "@theme";
import { StyleSheet, View, TouchableOpacity } from "react-native";

interface OwnProps {
  alarms: IReduxAlarm[];
  hasAlarms: boolean;
  setHasAlarms: React.Dispatch<React.SetStateAction<boolean>>;
}
export const _RecentAlarms: React.FC<OwnProps> = ({
  alarms,
  hasAlarms,
  setHasAlarms,
}) => {
  return (
    <View style={styles.mainContainer}>
      {alarms.map((alarm, index) => {
        let icon = (
          <MaterialCommunityIcons name="bell" size={20} color={colors.error} />
        );
        if (alarm.commandTypeId === 6) {
          icon = (
            <MaterialCommunityIcons
              name="engine"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 7) {
          icon = (
            <MaterialCommunityIcons
              name="engine-off"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 3) {
          icon = (
            <MaterialCommunityIcons
              name="power"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 4) {
          icon = (
            <MaterialCommunityIcons
              name="power-off"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 14) {
          icon = (
            <MaterialCommunityIcons
              name="clock-check"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 15) {
          icon = (
            <MaterialCommunityIcons
              name="clock-remove"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 16) {
          icon = (
            <FontAwesome5
              name="car-crash"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 13) {
          icon = (
            <MaterialCommunityIcons
              name="battery-alert"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else if (alarm.commandTypeId === 5) {
          icon = (
            <MaterialCommunityIcons
              name="battery-10"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        } else {
          icon = (
            <AntDesign
              name="questioncircle"
              size={20}
              color={index === 0 && hasAlarms ? colors.error : colors.titleText}
            />
          );
        }
        return (
          <TouchableOpacity
            key={index}
            onPress={(e) => {
              e.stopPropagation();
              setHasAlarms(false);
            }}
          >
            {icon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
});
