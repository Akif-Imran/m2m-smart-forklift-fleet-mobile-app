import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { gStyles, theme } from "@theme";

interface TimelineContentProps {
  data: {
    title: string;
    time: string;
    description: string;
    distance: string;
    start: boolean;
  };
}
const TimelineContent: React.FC<TimelineContentProps> = ({ data }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.descText}>{data.time}</Text>
        {data.start ? (
          <Text style={styles.descText}> {data.distance} km</Text>
        ) : null}
      </View>
      {/* <Text style={styles.timeText}>{data.time}</Text> */}
      <Text style={gStyles.tblHeaderText}>{data.description}</Text>
    </View>
  );
};

export { TimelineContent };

const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.sm,
    marginBottom: theme.spacing.xxxl,
    marginTop: -theme.spacing.lg,
    // borderWidth: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  descText: {
    ...gStyles.tblDescText,
    marginVertical: 2,
    lineHeight: 16,
  },
});
