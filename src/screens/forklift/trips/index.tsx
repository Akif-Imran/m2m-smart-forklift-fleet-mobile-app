import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { produce } from "immer";
import { SafeAreaView } from "react-native-safe-area-context";
import { mapStyles, screenStyles } from "@screen-styles";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { PaperTheme, colors, gStyles, theme } from "@theme";
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
  _BottomSheet,
  _DatePicker,
  _DefaultCard,
  _ListEmptyComponent,
  _RightSheet,
  _ScrollFormLayout,
} from "@components";
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { getDayTrip, getTripDetails } from "@services";
import { useSafeAreaDimensions } from "@hooks";
import { mapMarkers } from "@map-markers";
import { useAppSelector } from "@store";
import { FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12, ToastService } from "@utility";
import { defaultLocation } from "@constants";
import moment from "moment";
import { useAuthContext } from "@context";
import Spinner from "react-native-loading-spinner-overlay";
import { Button } from "react-native-paper";

import { _DayTripListCard } from "../components";

import type { Actions } from "./actions";
import { ACTION_TYPES } from "./actions";
import { styles } from "./styles";

interface State {
  journeyId: number;
  dayTrips: IDayTrip[];
  startTrackViewChanges: boolean;
  endTrackViewChanges: boolean;
  selectedTripDetails: ITripDetail[];
  selectedTripLine: CoordinatesType[];
  start: CoordinatesType;
  end: CoordinatesType;
}

const initialState: State = {
  journeyId: 0,
  dayTrips: [],
  startTrackViewChanges: true,
  endTrackViewChanges: true,
  selectedTripDetails: [],
  selectedTripLine: [],
  start: {
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
  },
  end: {
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
  },
};

const tripsReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case ACTION_TYPES.SET_JOURNEY:
      state.journeyId = action.payload.journeyId;
      return;
    case ACTION_TYPES.SET_DAY_TRIPS:
      if (action.payload.dayTrips.length > 0) {
        state.dayTrips = action.payload.dayTrips;
        state.journeyId = action.payload.dayTrips[0].id;
      }
      return;
    case ACTION_TYPES.SET_TRIP_DETAILS:
      const sorted = action.payload.tripDetails.sort((a, b) => a.id - b.id);
      state.selectedTripDetails = sorted;
      const mapped = sorted.map((loc) => ({
        latitude: parseFloat(loc.latitude),
        longitude: parseFloat(loc.longitude),
      }));
      state.selectedTripLine = mapped;
      state.start.latitude = mapped[0].latitude;
      state.start.longitude = mapped[0].longitude;
      state.end.latitude = mapped[mapped.length - 1].latitude;
      state.end.longitude = mapped[mapped.length - 1].longitude;
      return;
    case ACTION_TYPES.TRACK_VIEW_CHANGES_START:
      state.startTrackViewChanges = true;
      return;
    case ACTION_TYPES.UNTRACK_VIEW_CHANGES_START:
      state.startTrackViewChanges = false;
      return;
    case ACTION_TYPES.TRACK_VIEW_CHANGES_END:
      state.endTrackViewChanges = true;
      return;
    case ACTION_TYPES.UNTRACK_VIEW_CHANGES_END:
      state.endTrackViewChanges = false;
      return;
    default:
      return state;
  }
};

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
  const {
    state: { token },
  } = useAuthContext();
  const device = useAppSelector((state) =>
    state.devices.data.rows.find((dev) => dev.id === item.device_id)
  );
  const { SCREEN_HEIGHT, LATITUDE_DELTA, LONGITUDE_DELTA } =
    useSafeAreaDimensions();

  const activeStrokeWidth = 6;
  // const inactiveStrokeWidth = 3;
  const mapRef = React.useRef<MapView>(null);
  const sheetRef = React.useRef<BottomSheetRef>(null);
  const rightSheetRef = React.useRef<RightSheetRefProps>(null);

  const [state, dispatch] = React.useReducer(
    produce(tripsReducer),
    initialState
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [_isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const [region, setRegion] = React.useState({
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const handleSheet = React.useCallback((value: number) => {
    sheetRef.current?.scrollTo(value);
  }, []);

  const handleRightSheet = React.useCallback((value: number) => {
    console.log("called handle right sheet");
    rightSheetRef?.current?.scrollTo(value);
  }, []);

  const memoCallback = React.useCallback(() => {
    setRegion({
      latitude: defaultLocation.latitude,
      longitude: defaultLocation.longitude,
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
    // setSelectedRoute(coords);
    handleSheet(sheetPosition);
  };

  const handleGetTrips = () => {
    if (!item) {
      return;
    }
    const tripDate = moment(date).format("YYYY-MM-DD");
    if (tripDate === null) {
      ToastService.show("Invalid date");
      return;
    }
    fetchDayTrips(tripDate);
  };

  const fetchDayTrips = React.useCallback(
    (tripDate: string, withLoader = true) => {
      setIsLoading(withLoader);
      getDayTrip(token, { date: tripDate, deviceId: item?.device_id })
        .then((res) => {
          if (res.success) {
            if (res.result.length === 0) {
              return;
            }
            dispatch({
              type: ACTION_TYPES.SET_DAY_TRIPS,
              payload: { dayTrips: res.result },
            });
          } else {
            ToastService.show("An error occurred");
          }
        })
        .catch((_err) => {
          console.log(_err?.message);
          ToastService.show("An error occurred");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [token, item]
  );

  React.useEffect(() => {
    handleGetTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!item || !state.journeyId) {
      return;
    }
    const today = moment().format("YYYY-MM-DD");
    if (today === null) {
      ToastService.show("Invalid date");
      return;
    }
    console.log("journey id date", today);
    setIsLoading(true);
    getTripDetails(token, {
      date: today,
      deviceId: item?.device_id,
      journeyId: state.journeyId,
    })
      .then((res) => {
        if (res.success) {
          if (res.result.length === 0) {
            ToastService.show("No Details exist");
            return;
          }
          mapRef?.current?.animateCamera({
            center: {
              latitude: parseFloat(res.result[0].latitude),
              longitude: parseFloat(res.result[0].longitude),
            },
          });
          dispatch({
            type: ACTION_TYPES.SET_TRIP_DETAILS,
            payload: { tripDetails: res.result },
          });
        }
      })
      .catch((_err) => {
        console.log(_err?.message);
        ToastService.show("An error occurred.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, item, state.journeyId]);

  // console.log("trips", state.dayTrips);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size={"large"}
      />
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
          coordinates={state.selectedTripLine}
          strokeColor={colors.primary} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={activeStrokeWidth}
          zIndex={100}
        />
        {state.selectedTripLine.length !== 0 ? (
          <>
            <Marker
              tracksViewChanges={state.startTrackViewChanges}
              coordinate={state.start}
              rotation={mapMarkers[item.icon].rotate}
              centerOffset={mapMarkers[item.icon].offset}
              anchor={mapMarkers[item.icon].anchor}
              zIndex={100}
              style={mapMarkers[item.icon].size}
              onPress={() =>
                handleMarkerOnPress(
                  BOTTOM_SHEET_MAX_TRANSLATE_Y,
                  state.selectedTripLine,
                  0
                )
              }
            >
              <Image
                source={mapMarkers[item.icon].icon}
                onLoad={() =>
                  dispatch({ type: ACTION_TYPES.UNTRACK_VIEW_CHANGES_START })
                }
                style={mapMarkers[item.icon].size}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </Marker>
            <Marker
              tracksViewChanges={state.endTrackViewChanges}
              coordinate={state.end}
              rotation={mapMarkers["racing-flag"].rotate}
              anchor={mapMarkers["racing-flag"].anchor}
              centerOffset={mapMarkers["racing-flag"].offset}
              zIndex={100}
              style={theme.map.marker.size.md}
              onPress={() =>
                handleMarkerOnPress(
                  BOTTOM_SHEET_MAX_TRANSLATE_Y,
                  state.selectedTripLine,
                  state.selectedTripLine.length - 1
                )
              }
            >
              <Image
                source={mapMarkers["racing-flag"].icon}
                onLoad={() =>
                  dispatch({ type: ACTION_TYPES.UNTRACK_VIEW_CHANGES_END })
                }
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
            handleRightSheet(RIGHT_SHEET_MAX_TRANSLATE_X);
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
              <View style={styles.tripsDateSearch}>
                <TouchableOpacity
                  style={screenStyles.filterButtonStyle}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.menuDateHeader}>
                    {date.toDateString()}
                  </Text>
                </TouchableOpacity>
                <Button
                  theme={PaperTheme}
                  mode="contained"
                  onPress={() => handleGetTrips()}
                >
                  Get Trips
                </Button>
              </View>
              {state.dayTrips.length === 0 ? (
                <_ListEmptyComponent label="No Trips..." coversSpace={true} />
              ) : (
                <React.Fragment>
                  {state.dayTrips.map((trip) => {
                    return (
                      <_DayTripListCard
                        key={trip._id}
                        trip={trip}
                        selectedJourney={state.journeyId}
                        dispatch={dispatch}
                      />
                    );
                  })}
                </React.Fragment>
              )}
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
              <Text style={styles.descTextGray}>{item?.reg_no}</Text>
            </View>

            <View style={styles.sheetTopLeftRightIcon}>
              <Text style={styles.descTextGray}>{device?.IMEI}</Text>
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
              <Text style={styles.descTextGray}>
                {device?.back_battery_percentage || "N/A"}
              </Text>
            </View>

            <View style={styles.sheetTopIcon}>
              <MaterialCommunityIcons
                name="engine"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>
                {device?.is_ignition ? "On" : "Off"}
              </Text>
            </View>

            <View style={styles.sheetTopIcon}>
              <MaterialCommunityIcons
                name="arrow-up-drop-circle"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>
                {device?.voltage || "N/A"}
              </Text>
            </View>

            <View style={styles.sheetTopIcon}>
              <MaterialCommunityIcons
                name="satellite-variant"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>
                {device?.gps_accuracy || "N/A"}
              </Text>
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
                  <Text style={gStyles.tblHeaderText}>
                    {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12(
                      device?.gps_time || item?.updatedAt
                    )}
                  </Text>
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
                  <Text style={gStyles.tblHeaderText}>
                    {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12(item.updatedAt)}
                  </Text>
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
            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("BirdEyeView", {
                  mode: "multiple",
                })
              }
            >
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
                  tripLine: state.selectedTripLine,
                  tripDetails: state.selectedTripDetails,
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

            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("Fences", {
                  _id,
                  item,
                })
              }
            >
              <MaterialCommunityIcons
                name="wall"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Geo Fence</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("ForkLiftDetails", {
                  _id,
                  item,
                })
              }
            >
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() => ToastService.show("Under development")}
            >
              <Ionicons name="terminal" size={20} color={colors.titleText} />
              <Text style={styles.descTextGray}>Command</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Notification")}
            >
              <MaterialCommunityIcons
                name="alert"
                size={25}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() => ToastService.show("Under development")}
            >
              <MaterialCommunityIcons
                name="monitor"
                size={20}
                color={colors.titleText}
              />
              <Text style={styles.descTextGray}>Console</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetButton}
              activeOpacity={0.7}
              onPress={() => ToastService.show("Under development")}
            >
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
