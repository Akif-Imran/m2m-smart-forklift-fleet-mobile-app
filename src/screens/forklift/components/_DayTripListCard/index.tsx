import { Image, StyleSheet, View } from "react-native";
import React from "react";
import moment from "moment";
import { colors, gStyles, theme } from "@theme";
import { TimelineContent, _DefaultCard } from "@components";
import TimelineComponent from "react-native-timeline-flatlist";

import { ACTION_TYPES, type Actions } from "../../trips/actions";

interface OwnProps {
  trip: IDayTrip;
  dispatch: (value: Actions) => void;
  selectedJourney: number;
}
const _DayTripListCard: React.FC<OwnProps> = ({
  trip,
  dispatch,
  selectedJourney,
}) => {
  const routeAData = [
    {
      time: moment(trip.gps_start_time).format("hh:mm:ss A"),
      distance: `${trip.total_distance}`,
      title: "Start",
      description: `${trip.start_latitude}, ${trip.start_longitude}`,
      start: true,
      icon: (
        <Image
          style={{
            ...theme.img.size.xxs,
            tintColor: colors.primary,
          }}
          // eslint-disable-next-line import/extensions
          source={require("@assets/images/icons8-engine-96.png")}
        />
      ),
    },
    {
      time: moment(trip.gps_end_time).format("hh:mm:ss A"),
      distance: `${trip.total_distance}`,
      title: "Stop",
      start: false,
      description: `${trip.end_latitude}, ${trip.end_longitude}`,
      icon: (
        <Image
          style={{
            ...theme.img.size.xxs,
            tintColor: colors.error,
          }}
          // eslint-disable-next-line import/extensions
          source={require("@assets/images/icons8-engine-96.png")}
        />
      ),
    },
  ];
  return (
    <_DefaultCard
      onPress={() =>
        dispatch({
          type: ACTION_TYPES.SET_JOURNEY,
          payload: { journeyId: trip.id },
        })
      }
      style={
        trip.id === selectedJourney
          ? StyleSheet.compose(gStyles.card, {
              borderWidth: 0.5,
              borderColor: colors.primaryTransparent70,
            })
          : undefined
      }
      key={trip._id}
    >
      <View style={styles.TimelineComponentContainer}>
        <TimelineComponent
          isUsingFlatlist={false}
          showTime={false}
          data={routeAData}
          lineWidth={2}
          lineColor={colors.primary}
          innerCircle={"icon"}
          circleSize={35}
          columnFormat="single-column-left"
          circleStyle={styles.circleStyle}
          iconStyle={styles.iconStyle}
          listViewStyle={styles.listViewStyle}
          renderDetail={(rowData) => {
            return <TimelineContent data={rowData} />;
          }}
        />
      </View>
    </_DefaultCard>
  );
};

export { _DayTripListCard };

const styles = StyleSheet.create({
  //timeline component styles
  TimelineComponentContainer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    // borderWidth: 1,
  },
  circleStyle: {
    overflow: "hidden",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    borderWidth: 2,
  },
  iconStyle: {
    ...theme.img.size.xs,
    tintColor: colors.titleText,
  },
  listViewStyle: {
    paddingHorizontal: 10,
  },
});
