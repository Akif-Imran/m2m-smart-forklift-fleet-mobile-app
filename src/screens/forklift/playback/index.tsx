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

const Playback: React.FC<ForkliftStackScreenProps<"Playback">> = ({
  route,
}) => {
  const {
    vehicle: { _id, item },
  } = route.params;
  const polyline: CoordinatesType[] = route.params?.coords;
  const [trackViewChanges, setTrackViewChanges] = React.useState<boolean>(true);
  const [carTackViewChanges, setCarTrackViewChanges] =
    React.useState<boolean>(true);
  // console.log(polyline);
  const mapRef = React.useRef<MapView>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>();
  const [line, setLine] = React.useState<CoordinatesType[]>([polyline[0]]);
  const [playerInterval, setPlayerInterval] =
    React.useState<NodeJS.Timer | null>(null);
  const markerRef = React.useRef<MapMarker>(null);
  //   const [sliderValue, setSliderValue] = React.useState<number[]>([0]);
  const [playbackValue, setPlaybackValue] = React.useState<number[]>([0]);
  const [coordinate, setCoordinate] = React.useState({
    latitude: polyline[0].latitude,
    longitude: polyline[0].longitude,
  });
  const [prevCoordinate, setPrevCoordinate] = React.useState({
    latitude: polyline[0].latitude,
    longitude: polyline[0].longitude,
  });
  const calculateHeading = React.useCallback((cord1: LatLng, cord2: LatLng) => {
    if (cord2) {
      const { latitude: lat1, longitude: lng1 } = cord1;
      const { latitude: lat2, longitude: lng2 } = cord2;
      const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
      const θ = Math.atan2(y, x);
      const brng = ((θ * 180) / Math.PI + 360) % 360;
      return brng;
    }
    return 0;
  }, []);
  const [heading, setHeading] = React.useState(
    calculateHeading(prevCoordinate, polyline[1] ? polyline[1] : coordinate)
  );
  const [loc, _setLoc] = React.useState({
    pickupCords: {
      latitude: polyline[0].latitude,
      longitude: polyline[0].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    dropLocationCords: {
      latitude: polyline[polyline.length - 1].latitude,
      longitude: polyline[polyline.length - 1].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });

  const { dropLocationCords, pickupCords } = loc;

  const handleSliderValueChange = (value: number) => {
    if (value < playbackValue[0]) {
    }
    console.log(value);
    const coords = getCoordinate(polyline, value);
    const lineValues = polyline.slice(0, value + 1);
    const lineValuesLen = lineValues.length;
    const start =
      lineValues.length >= 2 ? lineValues[lineValuesLen - 2] : lineValues[0];
    const newHeading = calculateHeading(start, lineValues[lineValuesLen - 1]);
    // const newHeading = calculateHeading(coordinate, coords);
    console.log(newHeading, "heading");
    //  = [...line];
    // lineValues.push(coords);
    // markerRef.current?.animateMarkerToCoordinate({ latitude, longitude }, 3000);
    setPlaybackValue([value]);
    setLine(lineValues);
    setPrevCoordinate(coordinate);
    setCoordinate(coords);
    setHeading(newHeading);
    console.log(coords);
  };

  const getCoordinate = (currentLine: CoordinatesType[], index: number) => {
    // const index = Math.floor(playbackValue * (polyline.length - 1));
    // console.log(playbackValue);
    return currentLine[index];
  };

  const start = () => {
    setIsPlaying(true);
    const player = setInterval(() => {
      setPlaybackValue((prev) => {
        if (prev[0] === polyline.length - 1) {
          if (playerInterval) {
            clearInterval(playerInterval);
          }
          setIsPlaying(false);
          return prev;
        }
        console.log(prev[0]);
        const index = prev[0] + 1;
        // handleSliderValueChange([index + 1]);
        console.log(index);
        const coords = getCoordinate(polyline, index);
        setLine((prevLine) => {
          const lineValues = [...prevLine];
          lineValues.push(coords);
          // console.log(lineValues, 'lineValues');
          return lineValues;
        });
        // markerRef.current?.animateMarkerToCoordinate({ latitude, longitude }, 3000);
        setCoordinate((prevCoords) => {
          setPrevCoordinate(prevCoords);
          const newHeading = calculateHeading(prevCoords, coords);
          console.log(newHeading);
          setHeading(newHeading);
          return coords;
        });
        console.log(coords);
        return [index];
      });
    }, 1000);
    setPlayerInterval(player);
  };

  const stop = () => {
    setIsPlaying(false);
    if (playerInterval) {
      clearInterval(playerInterval);
    }
    setPlayerInterval(null);
  };

  const reset = () => {
    stop();
    setLine([polyline[0]]);
    setPlaybackValue([0]);
    setCoordinate({
      latitude: polyline[0].latitude,
      longitude: polyline[0].longitude,
    });
    setPrevCoordinate({
      latitude: polyline[0].latitude,
      longitude: polyline[0].longitude,
    });
    setHeading(
      calculateHeading(prevCoordinate, polyline[1] ? polyline[1] : coordinate)
    );
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
        initialRegion={pickupCords}
      >
        <Marker
          ref={markerRef}
          tracksViewChanges={carTackViewChanges}
          coordinate={coordinate}
          rotation={mapMarkers[item.icon].rotate}
          anchor={mapMarkers[item.icon].anchor}
          centerOffset={mapMarkers[item.icon].offset}
          style={StyleSheet.compose(theme.img.size.sm, {
            transform: [{ rotate: `${heading}deg` }],
          })}
        >
          <Image
            source={mapMarkers[item.icon].icon}
            onLoad={() => setCarTrackViewChanges(false)}
            style={mapMarkers[item.icon].size}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </Marker>

        <Marker
          tracksViewChanges={trackViewChanges}
          coordinate={dropLocationCords}
          rotation={mapMarkers["racing-flag"].rotate}
          anchor={mapMarkers["racing-flag"].anchor}
          centerOffset={mapMarkers["racing-flag"].offset}
          style={theme.map.marker.size.md}
          // onPress={() => handleMarkerOnPress(MAX_TRANSLATE_Y, coordsA[0])}
        >
          <Image
            source={mapMarkers["racing-flag"].icon}
            onLoad={() => setTrackViewChanges(false)}
            style={mapMarkers["racing-flag"].size}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </Marker>
        <Polyline
          coordinates={line}
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
                setIsPlaying((prev) => {
                  if (prev) {
                    stop();
                  } else {
                    start();
                  }
                  return !prev;
                });
              }}
            >
              {isPlaying ? (
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
              value={playbackValue[0]}
              onValueChange={handleSliderValueChange}
              maximumValue={polyline.length - 1}
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
          {/* <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",s
              borderWidth: 0,
              alignSelf: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                padding: 4,
                borderColor: colors.secondary,
                borderWidth: 0,
              }}
            >
              <MaterialCommunityIcons
                name="fast-forward"
                size={25}
                color={colors.primary}
              />
              <Text style={gStyles.tblHeaderText}>Slow</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <View>
          <View style={styles.detailsContainer}>
            <Text style={gStyles.tblHeaderText}>
              2023-01-31 00:00 - 2023-01-31 22:53
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
              <Text style={gStyles.tblHeaderText}>06:57:16</Text>
              <Text style={gStyles.tblHeaderText}>2023-01-31</Text>
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
              <Text style={gStyles.tblHeaderText}>49.0 km/ h</Text>
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
              <Text style={gStyles.tblHeaderText}>15.46 km</Text>
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
            <TouchableOpacity style={styles.buttons}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={20}
                color={colors.titleText}
              />
              {/* <Image
                // eslint-disable-next-line import/extensions
                source={require("@assets/images/icons8-journey-50.png")}
                style={{
                  tintColor: colors.titleText,
                  height: theme.img.size.xxs.height - 4,
                  width: theme.img.size.xxs.width - 4,
                }}
                resizeMode="contain"
              /> */}
              <Text style={gStyles.tblHeaderText}>Show</Text>
            </TouchableOpacity>
            {/* gps */}
            <TouchableOpacity
              style={StyleSheet.compose(styles.buttons, {
                flexDirection: "row",
              })}
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
