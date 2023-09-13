import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import type { LatLng, MapMarker } from "react-native-maps";
import MapView, { Marker, Polyline } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { colors, gStyles, theme } from "@theme";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { mapMarkers } from "@map-markers";
import { useSafeAreaDimensions } from "@hooks";
import moment from "moment";
import { ToastService } from "@utility";

interface IPolyline extends Omit<ITripDetail, "latitude" | "longitude"> {
  latitude: number;
  longitude: number;
}

interface State {
  isPlaying: boolean;
  startTrackViewChanges: boolean;
  endTrackViewChanges: boolean;
  completeTrip: IPolyline[]; //has complete trip path
  playbackLine: IPolyline[]; // will only have the point that are displayed using playback
  playbackIndex: number;
  currentPoint: IPolyline;
  previousPoint: IPolyline;
  startingPoint: LatLng;
  destinationPoint: IPolyline;
  heading: number;
}

const Playback: React.FC<ForkliftStackScreenProps<"Playback">> = ({
  route,
}) => {
  const {
    vehicle: { item },
  } = route.params;
  const { LATITUDE_DELTA, LONGITUDE_DELTA } = useSafeAreaDimensions();
  const tripLine = route.params?.tripDetails;

  const [state, setState] = React.useState<State>(() => {
    const point = {
      ...tripLine[0],
      latitude: parseFloat(tripLine[0].latitude),
      longitude: parseFloat(tripLine[0].longitude),
    };
    return {
      isPlaying: false,
      startTrackViewChanges: true,
      endTrackViewChanges: true,
      completeTrip: tripLine.map((linePoint) => ({
        ...linePoint,
        latitude: parseFloat(linePoint.latitude),
        longitude: parseFloat(linePoint.longitude),
      })),
      playbackLine: [point],
      playbackIndex: 0,
      currentPoint: point,
      previousPoint: point,
      startingPoint: point,
      destinationPoint: {
        ...tripLine[tripLine.length - 1],
        latitude: parseFloat(tripLine[tripLine.length - 1].latitude),
        longitude: parseFloat(tripLine[tripLine.length - 1].longitude),
      },
      heading: parseFloat(point.direction),
    };
  });
  const mapRef = React.useRef<MapView>(null);
  const [playerInterval, setPlayerInterval] =
    React.useState<NodeJS.Timer | null>(null);
  const markerRef = React.useRef<MapMarker>(null);

  const handleSliderValueChange = (value: number) => {
    setState((prev) => {
      return {
        ...prev,
        playbackIndex: value,
        playbackLine: prev.completeTrip.slice(0, value + 1),
        currentPoint: prev.completeTrip[value],
        previousPoint:
          value <= 0 ? prev.completeTrip[0] : prev.completeTrip[value - 1],
        heading: parseFloat(prev.completeTrip[value].direction),
      };
    });
  };

  const start = async () => {
    setState((prev) => ({ ...prev, isPlaying: true }));
    const player = setInterval(() => {
      setState((prev) => {
        console.log("prev", prev.isPlaying, prev.playbackIndex);
        if (prev.playbackIndex === prev.completeTrip.length - 1) {
          setPlayerInterval((prevInterval) => {
            if (prevInterval) {
              clearInterval(prevInterval);
            }
            return null;
          });
          return { ...prev, isPlaying: false };
        }
        const index = prev.playbackIndex + 1;
        return {
          ...prev,
          playbackIndex: index,
          isPlaying: true,
          previousPoint: prev.currentPoint,
          currentPoint: prev.completeTrip[index],
          playbackLine: prev.completeTrip.slice(0, index + 1),
          heading: parseFloat(prev.completeTrip[index].direction),
        };
      });
    }, 1000);
    setPlayerInterval(player);
  };

  const stop = () => {
    setState((prev) => ({ ...prev, isPlaying: false }));
    if (playerInterval) {
      clearInterval(playerInterval);
    }
    setPlayerInterval(null);
  };

  const reset = () => {
    stop();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      playbackLine: [prev.completeTrip[0]],
      playbackIndex: 0,
      currentPoint: prev.completeTrip[0],
      previousPoint: prev.completeTrip[0],
      heading: parseFloat(prev.completeTrip[0].direction),
    }));
  };

  const replay = () => {
    reset();
    start();
  };

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: state.startingPoint.latitude,
          longitude: state.startingPoint.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker
          ref={markerRef}
          tracksViewChanges={state.startTrackViewChanges}
          rotation={mapMarkers[item.icon].rotate}
          anchor={mapMarkers[item.icon].anchor}
          centerOffset={mapMarkers[item.icon].offset}
          coordinate={{
            latitude: state.currentPoint.latitude,
            longitude: state.currentPoint.longitude,
          }}
          style={StyleSheet.compose(theme.img.size.sm, {
            transform: [{ rotate: `${state.heading}deg` }],
          })}
        >
          <Image
            source={mapMarkers[item.icon].icon}
            onLoad={() =>
              setState((prev) => ({ ...prev, startTrackViewChanges: false }))
            }
            style={mapMarkers[item.icon].size}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </Marker>

        <Marker
          tracksViewChanges={state.endTrackViewChanges}
          rotation={mapMarkers["racing-flag"].rotate}
          anchor={mapMarkers["racing-flag"].anchor}
          centerOffset={mapMarkers["racing-flag"].offset}
          style={theme.map.marker.size.md}
          coordinate={{
            latitude: state.destinationPoint.latitude,
            longitude: state.destinationPoint.longitude,
          }}
          // onPress={() => handleMarkerOnPress(MAX_TRANSLATE_Y, coordsA[0])}
        >
          <Image
            source={mapMarkers["racing-flag"].icon}
            onLoad={() =>
              setState((prev) => ({ ...prev, endTrackViewChanges: false }))
            }
            style={mapMarkers["racing-flag"].size}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </Marker>
        <Polyline
          coordinates={state.playbackLine}
          strokeColor={colors.warning} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
          // zIndex={selected === 'C' ? 100 : 10}
        />
      </MapView>
      <View style={styles.playerWithDetailsContainer}>
        {/* player */}
        <View style={styles.playerContainer}>
          <View style={styles.playButtonContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                if (state.isPlaying) {
                  stop();
                } else {
                  start();
                }
              }}
            >
              {state.isPlaying ? (
                <MaterialCommunityIcons
                  name="pause"
                  size={25}
                  color={colors.primary}
                />
              ) : (
                <MaterialCommunityIcons
                  name="play"
                  size={25}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              value={state.playbackIndex}
              onValueChange={handleSliderValueChange}
              maximumValue={state.completeTrip.length - 1}
              minimumValue={0}
              step={1}
              thumbTintColor={colors.primary}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.iconGray}
              onSlidingStart={() => {
                stop();
              }}
            />
          </View>
        </View>
        <View>
          <View style={styles.detailsContainer}>
            <Text style={gStyles.tblHeaderText}>
              {moment(state.completeTrip[0].gps_time).format(
                "DD MMM, YYYY hh:mm:ss A"
              )}{" "}
              -{" "}
              {moment(
                state.completeTrip[state.completeTrip.length - 1].gps_time
              ).format("DD MMM, YYYY hh:mm:ss A")}
            </Text>
            <TouchableOpacity>
              <MaterialIcons name="loop" size={20} color={colors.titleText} />
            </TouchableOpacity>
          </View>
        </View>
        {/* info */}
        <View style={styles.rowContainer}>
          {/* time */}
          <View style={styles.detailsWithIcons}>
            <View>
              <MaterialCommunityIcons
                name="clock-time-three-outline"
                size={20}
                color={colors.titleText}
              />
            </View>
            <View>
              <Text style={gStyles.tblHeaderText}>
                {moment(state.currentPoint.gps_time).format("hh:mm:ss A")}
              </Text>
              <Text style={gStyles.tblHeaderText}>
                {moment(state.currentPoint.gps_time).format("DD MMM, YYYY")}
              </Text>
            </View>
          </View>
          {/* speed */}
          <View style={styles.detailsWithIcons}>
            <View>
              <MaterialCommunityIcons
                name="speedometer-slow"
                size={20}
                color={colors.titleText}
              />
            </View>
            <View>
              <Text style={gStyles.tblHeaderText}>
                {state.currentPoint.speed} km/ h
              </Text>
            </View>
          </View>
          {/* distance */}
          <View style={styles.detailsWithIcons}>
            <View>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={20}
                color={colors.titleText}
              />
            </View>
            <View>
              <Text style={gStyles.tblHeaderText}>
                {state.currentPoint.mileage} km
              </Text>
            </View>
          </View>
        </View>
        {/* details */}
        <View style={styles.rowContainer}>
          <View>
            <Text style={gStyles.tblHeaderText}>{item.reg_no}</Text>
          </View>

          <View style={styles.buttonsContainer}>
            {/* replay */}
            <TouchableOpacity style={styles.buttons} onPress={() => replay()}>
              <MaterialCommunityIcons
                name="replay"
                size={20}
                color={colors.titleText}
              />
              <Text style={gStyles.tblHeaderText}>Replay</Text>
            </TouchableOpacity>
            {/* show */}
            {/* <TouchableOpacity style={styles.buttons}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={20}
                color={colors.titleText}
              />
              <Text style={gStyles.tblHeaderText}>Show</Text>
            </TouchableOpacity> */}
            {/* gps */}
            <TouchableOpacity
              style={StyleSheet.compose(styles.buttons, {
                flexDirection: "row",
              })}
              onPress={() => ToastService.show("Under development")}
            >
              <Text style={[gStyles.tblHeaderText, { color: colors.primary }]}>
                GPS
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export { Playback };

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
  playerWithDetailsContainer: {
    position: "absolute",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 4.2,
    backgroundColor: colors.white,
    bottom: 0,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: theme.spacing.md,
    borderWidth: 0,
  },
  playButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  playButton: {
    padding: theme.spacing.xs,
    borderColor: colors.primary,
    borderRadius: theme.radius.full,
    borderWidth: 2,
  },
  sliderContainer: { flex: 6, justifyContent: "center" },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    columnGap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    marginTop: -theme.spacing.md,
  },
  detailsWithIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: theme.spacing.sm,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: colors.borderColor,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderTopWidth: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  buttons: {
    rowGap: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
