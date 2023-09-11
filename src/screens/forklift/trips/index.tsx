import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import TimelineComponent from "react-native-timeline-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";
import { mapStyles, screenStyles } from "@screen-styles";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { colors, gStyles, theme } from "@theme";
import {
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import type { BottomSheetRef, RightSheetRefProps } from "@components";
import {
  BOTTOM_SHEET_MAX_TRANSLATE_Y,
  RIGHT_SHEET_MAX_TRANSLATE_X,
  RIGHT_SHEET_MIN_TRANSLATE_X,
  TimelineContent,
  _BottomSheet,
  _DatePicker,
  _DefaultCard,
  _RightSheet,
  _ScrollFormLayout,
} from "@components";
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { getDirections } from "@services";
import { useSafeAreaDimensions } from "@hooks";
import { mapMarkers } from "@map-markers";

import { styles } from "./styles";

const routeAData = [
  {
    time: "11:20 AM",
    distance: "2.8 Km",
    title: "Start",
    description: "Street 21, District 3 Lahore",
    start: true,
    icon: (
      <Image
        style={{ ...theme.img.size.xxs, tintColor: colors.primary }}
        // eslint-disable-next-line import/extensions
        source={require("@assets/images/icons8-engine-96.png")}
      />
    ),
  },
  {
    time: "3:55 PM",
    distance: "2.8 Km",
    title: "Stop",
    start: false,
    description: "Street 21, District 3 Lahore",
    icon: (
      <Image
        style={{ ...theme.img.size.xxs, tintColor: colors.error }}
        // eslint-disable-next-line import/extensions
        source={require("@assets/images/icons8-engine-96.png")}
      />
    ),
  },
];

const Trips: React.FC<ForkliftStackScreenProps<"Trips">> = ({
  navigation,
  route,
}) => {
  // const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  // const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
  // const LATITUDE_DELTA = 0.0922;
  // const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  // const { bottom: BOT_INSET, top: TOP_INSET } = useSafeAreaInsets();
  const { _id, item } = route.params;
  const { SCREEN_HEIGHT, LATITUDE_DELTA, LONGITUDE_DELTA } =
    useSafeAreaDimensions();

  const activeStrokeWidth = 8;
  const inactiveStrokeWidth = 3;
  const mapRef = React.useRef<MapView>(null);
  const sheetRef = React.useRef<BottomSheetRef>(null);
  const rightSheetRef = React.useRef<RightSheetRefProps>(null);
  const [date, setDate] = React.useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [_isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const [viewTrackingA1, setViewTrackingA1] = React.useState<boolean>(true);
  const [viewTrackingA2, setViewTrackingA2] = React.useState<boolean>(true);
  const [selectedRoute, setSelectedRoute] = React.useState<CoordinatesType[]>(
    []
  );
  // const [viewTrackingB1, setViewTrackingB1] = React.useState<boolean>(true);
  // const [viewTrackingB2, setViewTrackingB2] = React.useState<boolean>(true);
  const [viewTrackingC1, setViewTrackingC1] = React.useState<boolean>(true);
  const [viewTrackingC2, setViewTrackingC2] = React.useState<boolean>(true);
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [coordsA, setCoordsA] = React.useState<CoordinatesType[]>([]);
  const [coordsB, setCoordsB] = React.useState<CoordinatesType[]>([]);
  const [coordsC, setCoordsC] = React.useState<CoordinatesType[]>([]);
  const [selected, setSelected] = React.useState<string>("A");
  const [distanceA, setDistanceA] = React.useState<number>(0);
  const [_distanceB, setDistanceB] = React.useState<number>(0);
  const [distanceC, setDistanceC] = React.useState<number>(0);

  const handleSheet = React.useCallback((value: number) => {
    sheetRef.current?.scrollTo(value);
  }, []);

  const setSelectedRouteValues = (slctRoute: string) => {
    if (slctRoute === "A") {
      console.log("A");
      setSelected("A");
      setSelectedRoute(coordsA);
      rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MIN_TRANSLATE_X);
    } else if (slctRoute === "B") {
      console.log("B");
      setSelected("B");
      setSelectedRoute(coordsB);
      rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MIN_TRANSLATE_X);
    } else if (slctRoute === "C") {
      console.log("C");
      setSelected("C");
      setSelectedRoute(coordsC);
      rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MIN_TRANSLATE_X);
    }
  };

  React.useEffect(() => {
    getDirections("37.8025259,-122.4351431", "37.7896386,-122.421646").then(
      (res) => {
        setCoordsA(res.coords);
        setDistanceA(res.distance);
      }
    );
    getDirections("37.7948605,-122.4596065", "37.8025259,-122.4351431").then(
      (res) => {
        setCoordsB(res.coords);
        setDistanceB(res.distance);
      }
    );
    getDirections("37.7665248,-122.4161628", "37.7948605,-122.4596065").then(
      (res) => {
        setCoordsC(res.coords);
        setDistanceC(res.distance);
      }
    );
  }, []);

  // React.useEffect(() => {}, [mapRef, isMapReady]);

  const handleRightSheet = React.useCallback(() => {
    console.log("called handle right sheet");
    rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MAX_TRANSLATE_X);
  }, []);

  const memoCallback = React.useCallback(() => {
    setRegion({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  }, [setRegion, LATITUDE_DELTA, LONGITUDE_DELTA]);

  useFocusEffect(memoCallback);

  const handleMarkerOnPress = (
    sheetPosition: number,
    coords: CoordinatesType[],
    index: number
  ) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coords[index].latitude,
        longitude: coords[index].longitude,
      },
    });
    setSelectedRoute(coords);
    handleSheet(sheetPosition);
  };

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        loadingEnabled={true}
        loadingBackgroundColor={colors.white}
        loadingIndicatorColor={colors.secondary}
        onMapLoaded={() => setIsMapReady(true)}
      >
        <Polyline
          coordinates={coordsA}
          strokeColor={colors.primary} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={
            selected === "A" ? activeStrokeWidth : inactiveStrokeWidth
          }
          zIndex={selected === "A" ? 100 : 10}
        />
        {coordsA.length !== 0 ? (
          <>
            <Marker
              tracksViewChanges={viewTrackingA1}
              coordinate={coordsA[0]}
              rotation={mapMarkers[item.icon].rotate}
              // anchor={{ x: 0.2, y: 0.25 }}
              centerOffset={mapMarkers[item.icon].offset}
              anchor={mapMarkers[item.icon].anchor}
              zIndex={selected === "A" ? 100 : -100}
              style={mapMarkers[item.icon].size}
              onPress={() =>
                handleMarkerOnPress(BOTTOM_SHEET_MAX_TRANSLATE_Y, coordsA, 0)
              }
            >
              <Image
                // source={require("@assets/images/3d-car-top-view-white.png")}
                source={mapMarkers[item.icon].icon}
                onLoad={() => setViewTrackingA1(false)}
                style={mapMarkers[item.icon].size}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </Marker>
            <Marker
              tracksViewChanges={viewTrackingA2}
              coordinate={coordsA[coordsA.length - 1]}
              rotation={mapMarkers["racing-flag"].rotate}
              anchor={mapMarkers["racing-flag"].anchor}
              centerOffset={mapMarkers["racing-flag"].offset}
              zIndex={selected === "A" ? 100 : -100}
              style={theme.map.marker.size.md}
              onPress={() =>
                handleMarkerOnPress(
                  BOTTOM_SHEET_MAX_TRANSLATE_Y,
                  coordsA,
                  coordsA.length - 1
                )
              }
            >
              <Image
                source={mapMarkers["racing-flag"].icon}
                onLoad={() => setViewTrackingA2(false)}
                style={mapMarkers["racing-flag"].size}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </Marker>
          </>
        ) : null}
        {/* <Polyline
          coordinates={coordsB}
          strokeColor={colors.error} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={selected === "B" ? activeStrokeWidth : inactiveStrokeWidth}
          zIndex={selected === "B" ? 100 : 10}
        />
        {coordsB.length !== 0 ? (
          <>
            <Marker
              tracksViewChanges={viewTrackingB1}
              // icon={require('../../assets/images/3d-truck-top-view-blue.png')}
              coordinate={coordsB[0]}
              rotation={70}
              anchor={{ x: 0.3, y: 0.25 }}
              zIndex={selected === "B" ? 100 : -100}
              style={{ width: 60, height: 60 }}
              onPress={() => handleMarkerOnPress(BOTTOM_SHEET_MAX_TRANSLATE_Y, coordsB[0])}
            >
              <Image
                source={require("@assets/images/3d-truck-top-view-blue.png")}
                onLoad={() => setViewTrackingB1(false)}
                style={{ width: 45, height: 45 }}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </Marker>
            <Marker
              tracksViewChanges={viewTrackingB2}
              // icon={require('../../assets/images/3d-truck-top-view-blue.png')}
              coordinate={coordsB[coordsB.length - 1]}
              rotation={105}
              anchor={{ x: 0.25, y: 0.25 }}
              zIndex={selected === "B" ? 100 : -100}
              style={{ width: 60, height: 60 }}
              onPress={() =>
                handleMarkerOnPress(BOTTOM_SHEET_MAX_TRANSLATE_Y, coordsB[coordsB.length - 1])
              }
            >
              <Image
                source={require("@assets/images/3d-truck-top-view-blue.png")}
                onLoad={() => setViewTrackingB2(false)}
                style={{ width: 45, height: 45 }}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </Marker>
          </>
        ) : null} */}
        <Polyline
          coordinates={coordsC}
          strokeColor={colors.warning} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={
            selected === "C" ? activeStrokeWidth : inactiveStrokeWidth
          }
          zIndex={selected === "C" ? 100 : 10}
        />
        {coordsC.length !== 0 ? (
          <>
            <Marker
              tracksViewChanges={viewTrackingC1}
              coordinate={coordsC[0]}
              rotation={-5}
              anchor={{ x: 0.2, y: 0.3 }}
              zIndex={selected === "C" ? 100 : -100}
              style={theme.map.marker.size.md}
              onPress={() =>
                handleMarkerOnPress(BOTTOM_SHEET_MAX_TRANSLATE_Y, coordsC, 0)
              }
            >
              <Image
                source={mapMarkers[item.icon].icon}
                onLoad={() => setViewTrackingC1(false)}
                style={mapMarkers[item.icon].size}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </Marker>
            <Marker
              tracksViewChanges={viewTrackingC2}
              coordinate={coordsC[coordsC.length - 1]}
              rotation={mapMarkers["racing-flag"].rotate}
              anchor={mapMarkers["racing-flag"].anchor}
              centerOffset={mapMarkers["racing-flag"].offset}
              zIndex={selected === "C" ? 100 : -100}
              style={theme.map.marker.size.md}
              onPress={() =>
                handleMarkerOnPress(
                  BOTTOM_SHEET_MAX_TRANSLATE_Y,
                  coordsC,
                  coordsC.length - 1
                )
              }
            >
              <Image
                source={mapMarkers["racing-flag"].icon}
                onLoad={() => setViewTrackingC2(false)}
                style={mapMarkers["racing-flag"].size}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </Marker>
          </>
        ) : null}
      </MapView>

      <View style={mapStyles.defaultControls} pointerEvents="box-none">
        <TouchableOpacity
          style={screenStyles.filterButtonStyle}
          activeOpacity={0.8}
          onPress={() => {
            handleRightSheet();
          }}
        >
          <MaterialCommunityIcons
            name="menu"
            size={20}
            color={colors.titleText}
          />
        </TouchableOpacity>
      </View>

      <_RightSheet
        ref={rightSheetRef}
        height={SCREEN_HEIGHT}
        initialPosition="close"
      >
        <SafeAreaView style={screenStyles.mainContainer}>
          <_ScrollFormLayout>
            <View>
              {/* date pick text button */}
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.menuDateHeader}>{date.toDateString()}</Text>
              </TouchableOpacity>
              {/* render item */}
              <_DefaultCard onPress={() => setSelectedRouteValues("A")}>
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
                      return (
                        <TimelineContent
                          data={rowData}
                          distanceInMeters={distanceA}
                        />
                      );
                    }}
                  />
                </View>
              </_DefaultCard>
              {/* <Card
                style={styles.timelineCard}
                onPress={() => setSelectedRouteValues("B")}
                elevation={4}
              >
                <View style={{ marginTop: 15, paddingHorizontal: 8 }}>
                  <TimelineComponent
                    isUsingFlatlist={false}
                    showTime={false}
                    data={routeAData}
                    lineWidth={2}
                    lineColor={colors.error}
                    innerCircle={"icon"}
                    circleSize={35}
                    columnFormat="single-column-left"
                    circleStyle={{
                      overflow: "hidden",
                      borderRadius: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: colors.borderColor,
                      backgroundColor: colors.white,
                      borderWidth: 2,
                    }}
                    iconStyle={{
                      width: 25,
                      height: 25,
                      tintColor: colors.titleText,
                    }}
                    listViewStyle={{
                      paddingHorizontal: 10,
                    }}
                    renderDetail={(rowData) => {
                      return <TimelineContent data={rowData} distanceInMeters={distanceB} />;
                    }}
                  />
                </View>
              </Card> */}
              <_DefaultCard onPress={() => setSelectedRouteValues("C")}>
                <View style={styles.TimelineComponentContainer}>
                  <TimelineComponent
                    isUsingFlatlist={false}
                    showTime={false}
                    data={routeAData}
                    lineWidth={2}
                    lineColor={colors.warning}
                    innerCircle={"icon"}
                    circleSize={35}
                    columnFormat="single-column-left"
                    circleStyle={styles.circleStyle}
                    iconStyle={styles.iconStyle}
                    listViewStyle={styles.listViewStyle}
                    renderDetail={(rowData) => {
                      return (
                        <TimelineContent
                          data={rowData}
                          distanceInMeters={distanceC}
                        />
                      );
                    }}
                  />
                </View>
              </_DefaultCard>
            </View>
          </_ScrollFormLayout>
        </SafeAreaView>
      </_RightSheet>

      <_BottomSheet ref={sheetRef}>
        <View style={styles.sheetMainContainer}>
          {/* left right arrows */}
          <View style={styles.sheetTopLeftRightContainer}>
            <View style={styles.sheetTopLeftRightIcon}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>WMY2186</Text>
            </View>

            <View style={styles.sheetTopLeftRightIcon}>
              <Text style={styles.descTextGray}>075034760941</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color={colors.titleText}
              />
            </View>
          </View>

          {/* icons */}
          <View style={styles.sheetTopIconRow}>
            <View style={styles.sheetTopIcon}>
              <MaterialIcons
                name="offline-bolt"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>2hr</Text>
            </View>

            <View style={styles.sheetTopIcon}>
              <MaterialCommunityIcons
                name="engine"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Off</Text>
            </View>

            <View style={styles.sheetTopIcon}>
              <MaterialCommunityIcons
                name="arrow-up-drop-circle"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>12.55v</Text>
            </View>

            <View style={styles.sheetTopIcon}>
              <MaterialCommunityIcons
                name="satellite-variant"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>15</Text>
            </View>

            <TouchableOpacity style={styles.sheetTopIcon}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={35}
                color={colors.titleText}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.lastPositioningWithAddressContainer}>
            <View style={styles.lastUpdateRow}>
              <View style={styles.lastUpdateContainer}>
                <View>
                  <MaterialIcons
                    name="location-on"
                    size={25}
                    color={colors.titleText}
                  />
                </View>
                <View>
                  <Text style={gStyles.tblHeaderText}>2023-01-31 20:07:03</Text>
                  <Text style={gStyles.tblDescText}>Last Positioning</Text>
                </View>
              </View>

              <View style={styles.lastUpdateContainer}>
                <View>
                  <Fontisto
                    name="heartbeat-alt"
                    size={25}
                    color={colors.titleText}
                  />
                </View>
                <View>
                  <Text style={gStyles.tblHeaderText}>2023-01-31 20:07:03</Text>
                  <Text style={gStyles.tblDescText}>Last Update</Text>
                </View>
              </View>
            </View>

            <View>
              <Text
                style={StyleSheet.compose(gStyles.tblHeaderText, {
                  color: colors.info,
                  textDecorationLine: "underline",
                })}
              >
                View address
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.sheetButton} activeOpacity={0.7}>
              <MaterialIcons
                name="location-on"
                size={25}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Tracking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("Playback", {
                  coords: selectedRoute,
                  vehicle: {
                    _id: _id,
                    item: item,
                  },
                })
              }
            >
              <FontAwesome5 name="route" size={20} color={colors.titleText} />
              <Text style={styles.descTextGray}>Playback</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="wall"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Geo Fence</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.sheetButton} activeOpacity={0.7}>
              <Ionicons name="terminal" size={20} color={colors.titleText} />
              <Text style={styles.descTextGray}>Command</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="alert"
                size={25}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="monitor"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Console</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetButton} activeOpacity={0.7}>
              <MaterialIcons
                name="more-horiz"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </_BottomSheet>
      <_DatePicker
        show={showDatePicker}
        setShow={setShowDatePicker}
        mode={"date"}
        date={date}
        setDate={setDate}
      />
    </SafeAreaView>
  );
};

export { Trips };
