/* eslint-disable camelcase */
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
            //TODO - remove after testing
            res.result.push({
              device_id: 1,
              gps_start_time: "2023-08-26T04:25:48.000Z",
              gps_end_time: "2023-08-26T04:28:30.000Z",
              total_distance: "8.7",
              start_latitude: "2.970357",
              end_latitude: "2.970037",
              start_longitude: "101.609639",
              end_longitude: "101.609633",
              duration: 162,
              __v: 0,
              id: 1,
              createdAt: "",
              _id: "",
              touch_id: 0,
              end_mileage: "",
              start_mileage: "",
              start_time: "",
              end_time: "",
            });
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
          //TODO - remove self added trips points
          res.result = [
            {
              id: 3,
              journey_id: 1,
              device_id: 17,
              latitude: "2.924399",
              longitude: "101.649493",
              mileage: "16.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:44:12.000Z",
              direction: "0",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:44:29.367Z",
            },
            {
              id: 7,
              journey_id: 1,
              device_id: 17,
              latitude: "2.923853",
              longitude: "101.649943",
              mileage: "16.5",
              speed: "35.0",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:44:42.000Z",
              direction: "168",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:44:43.291Z",
            },
            {
              id: 8,
              journey_id: 1,
              device_id: 17,
              latitude: "2.922851",
              longitude: "101.650060",
              mileage: "16.6",
              speed: "49.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:44:51.000Z",
              direction: "176",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:44:53.770Z",
            },
            {
              id: 9,
              journey_id: 1,
              device_id: 17,
              latitude: "2.922727",
              longitude: "101.650065",
              mileage: "16.7",
              speed: "49.1",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:44:52.000Z",
              direction: "179",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:44:59.772Z",
            },
            {
              id: 10,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921848",
              longitude: "101.650027",
              mileage: "16.8",
              speed: "7.1",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:45:02.000Z",
              direction: "182",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:45:13.712Z",
            },
            {
              id: 12,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921130",
              longitude: "101.649609",
              mileage: "16.9",
              speed: "35.9",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:45:22.000Z",
              direction: "270",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:45:28.171Z",
            },
            {
              id: 13,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921169",
              longitude: "101.648728",
              mileage: "17.0",
              speed: "52.6",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:45:30.000Z",
              direction: "276",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:45:31.572Z",
            },
            {
              id: 14,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921206",
              longitude: "101.648454",
              mileage: "17.1",
              speed: "56.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:45:32.000Z",
              direction: "278",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:45:44.158Z",
            },
            {
              id: 15,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921527",
              longitude: "101.647271",
              mileage: "17.1",
              speed: "28.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:45:42.000Z",
              direction: "289",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:45:45.788Z",
            },
            {
              id: 20,
              journey_id: 1,
              device_id: 17,
              latitude: "2.922083",
              longitude: "101.645668",
              mileage: "17.4",
              speed: "52.8",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:46:52.000Z",
              direction: "289",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:47:10.352Z",
            },
            {
              id: 21,
              journey_id: 1,
              device_id: 17,
              latitude: "2.922523",
              longitude: "101.644257",
              mileage: "17.6",
              speed: "64.3",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:47:02.000Z",
              direction: "283",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:47:16.917Z",
            },
            {
              id: 22,
              journey_id: 1,
              device_id: 17,
              latitude: "2.922454",
              longitude: "101.640610",
              mileage: "18.0",
              speed: "86.5",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:47:21.000Z",
              direction: "254",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:47:28.799Z",
            },
            {
              id: 24,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921784",
              longitude: "101.638654",
              mileage: "18.2",
              speed: "67.4",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:47:31.000Z",
              direction: "255",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:47:44.049Z",
            },
            {
              id: 23,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921668",
              longitude: "101.638079",
              mileage: "18.2",
              speed: "26.9",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:47:36.000Z",
              direction: "260",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:47:41.614Z",
            },
            {
              id: 27,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921576",
              longitude: "101.637312",
              mileage: "18.3",
              speed: "47.0",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:48:21.000Z",
              direction: "267",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:48:28.775Z",
            },
            {
              id: 28,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921543",
              longitude: "101.635795",
              mileage: "18.6",
              speed: "70.0",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:48:31.000Z",
              direction: "268",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:48:43.173Z",
            },
            {
              id: 29,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921116",
              longitude: "101.633925",
              mileage: "18.7",
              speed: "31.6",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:48:45.000Z",
              direction: "243",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:48:46.609Z",
            },
            {
              id: 32,
              journey_id: 1,
              device_id: 17,
              latitude: "2.919818",
              longitude: "101.631996",
              mileage: "19.0",
              speed: "64.9",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:49:21.000Z",
              direction: "231",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:49:28.591Z",
            },
            {
              id: 33,
              journey_id: 1,
              device_id: 17,
              latitude: "2.918897",
              longitude: "101.630814",
              mileage: "19.2",
              speed: "58.3",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:49:31.000Z",
              direction: "231",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:49:43.068Z",
            },
            {
              id: 34,
              journey_id: 1,
              device_id: 17,
              latitude: "2.916820",
              longitude: "101.628474",
              mileage: "19.5",
              speed: "63.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:49:51.000Z",
              direction: "233",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:49:57.831Z",
            },
            {
              id: 35,
              journey_id: 1,
              device_id: 17,
              latitude: "2.915993",
              longitude: "101.627149",
              mileage: "19.7",
              speed: "61.1",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:50:01.000Z",
              direction: "238",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:50:16.275Z",
            },
            {
              id: 36,
              journey_id: 1,
              device_id: 17,
              latitude: "2.914405",
              longitude: "101.625593",
              mileage: "19.9",
              speed: "36.8",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:50:18.000Z",
              direction: "188",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:50:21.269Z",
            },
            {
              id: 37,
              journey_id: 1,
              device_id: 17,
              latitude: "2.914175",
              longitude: "101.625475",
              mileage: "19.9",
              speed: "34.3",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:50:21.000Z",
              direction: "228",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:50:24.187Z",
            },
            {
              id: 38,
              journey_id: 1,
              device_id: 17,
              latitude: "2.914175",
              longitude: "101.625475",
              mileage: "19.9",
              speed: "34.3",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:50:21.000Z",
              direction: "228",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:50:25.308Z",
            },
            {
              id: 39,
              journey_id: 1,
              device_id: 17,
              latitude: "2.914147",
              longitude: "101.625220",
              mileage: "19.9",
              speed: "38.3",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:50:24.000Z",
              direction: "290",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:50:31.903Z",
            },
            {
              id: 40,
              journey_id: 1,
              device_id: 17,
              latitude: "2.914382",
              longitude: "101.625069",
              mileage: "20.0",
              speed: "40.4",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:50:27.000Z",
              direction: "354",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:50:52.222Z",
            },
            {
              id: 41,
              journey_id: 1,
              device_id: 17,
              latitude: "2.914818",
              longitude: "101.625146",
              mileage: "20.1",
              speed: "49.0",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:50:31.000Z",
              direction: "2",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:51:05.399Z",
            },
            {
              id: 42,
              journey_id: 1,
              device_id: 17,
              latitude: "2.918311",
              longitude: "101.624498",
              mileage: "20.5",
              speed: "81.0",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:50:51.000Z",
              direction: "348",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:51:07.218Z",
            },
            {
              id: 44,
              journey_id: 1,
              device_id: 17,
              latitude: "2.920121",
              longitude: "101.624128",
              mileage: "20.7",
              speed: "54.5",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:51:01.000Z",
              direction: "348",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:51:19.953Z",
            },
            {
              id: 43,
              journey_id: 1,
              device_id: 17,
              latitude: "2.920582",
              longitude: "101.624037",
              mileage: "20.7",
              speed: "0.1",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:51:09.000Z",
              direction: "349",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:51:18.514Z",
            },
            {
              id: 47,
              journey_id: 1,
              device_id: 17,
              latitude: "2.921266",
              longitude: "101.623897",
              mileage: "20.8",
              speed: "45.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:51:50.000Z",
              direction: "348",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:52:34.948Z",
            },
            {
              id: 48,
              journey_id: 1,
              device_id: 17,
              latitude: "2.922752",
              longitude: "101.623606",
              mileage: "21.1",
              speed: "71.0",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:52:00.000Z",
              direction: "348",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:52:36.942Z",
            },
            {
              id: 49,
              journey_id: 1,
              device_id: 17,
              latitude: "2.927025",
              longitude: "101.622751",
              mileage: "21.5",
              speed: "94.9",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:52:20.000Z",
              direction: "349",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:52:38.946Z",
            },
            {
              id: 50,
              journey_id: 1,
              device_id: 17,
              latitude: "2.929130",
              longitude: "101.622316",
              mileage: "21.9",
              speed: "84.5",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:52:30.000Z",
              direction: "348",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:52:47.618Z",
            },
            {
              id: 51,
              journey_id: 1,
              device_id: 17,
              latitude: "2.932767",
              longitude: "101.621491",
              mileage: "22.0",
              speed: "65.8",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:52:48.000Z",
              direction: "321",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:52:48.894Z",
            },
            {
              id: 52,
              journey_id: 1,
              device_id: 17,
              latitude: "2.933021",
              longitude: "101.621262",
              mileage: "22.2",
              speed: "69.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:52:50.000Z",
              direction: "316",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:52:57.051Z",
            },
            {
              id: 54,
              journey_id: 1,
              device_id: 17,
              latitude: "2.934429",
              longitude: "101.619905",
              mileage: "22.5",
              speed: "78.2",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:53:00.000Z",
              direction: "315",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:53:12.253Z",
            },
            {
              id: 53,
              journey_id: 1,
              device_id: 17,
              latitude: "2.935555",
              longitude: "101.618792",
              mileage: "22.5",
              speed: "57.5",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:53:09.000Z",
              direction: "328",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:53:11.261Z",
            },
            {
              id: 55,
              journey_id: 1,
              device_id: 17,
              latitude: "2.937308",
              longitude: "101.618517",
              mileage: "22.8",
              speed: "73.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:53:20.000Z",
              direction: "354",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:53:26.908Z",
            },
            {
              id: 56,
              journey_id: 1,
              device_id: 17,
              latitude: "2.939217",
              longitude: "101.618181",
              mileage: "23.1",
              speed: "81.1",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:53:30.000Z",
              direction: "348",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:53:48.388Z",
            },
            {
              id: 57,
              journey_id: 1,
              device_id: 17,
              latitude: "2.943564",
              longitude: "101.617294",
              mileage: "23.5",
              speed: "87.1",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:53:50.000Z",
              direction: "348",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:53:58.225Z",
            },
            {
              id: 58,
              journey_id: 1,
              device_id: 17,
              latitude: "2.945440",
              longitude: "101.616917",
              mileage: "23.7",
              speed: "71.6",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:54:00.000Z",
              direction: "351",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:54:10.587Z",
            },
            {
              id: 59,
              journey_id: 1,
              device_id: 17,
              latitude: "2.946762",
              longitude: "101.616862",
              mileage: "23.7",
              speed: "37.3",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:54:09.000Z",
              direction: "0",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:54:11.785Z",
            },
            {
              id: 61,
              journey_id: 1,
              device_id: 17,
              latitude: "2.946886",
              longitude: "101.616867",
              mileage: "23.7",
              speed: "3.6",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:54:12.000Z",
              direction: "3",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:54:15.341Z",
            },
            {
              id: 63,
              journey_id: 1,
              device_id: 17,
              latitude: "2.947148",
              longitude: "101.616868",
              mileage: "23.9",
              speed: "31.4",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:54:30.000Z",
              direction: "359",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:54:41.942Z",
            },
            {
              id: 64,
              journey_id: 1,
              device_id: 17,
              latitude: "2.949769",
              longitude: "101.616891",
              mileage: "24.1",
              speed: "50.4",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:54:50.000Z",
              direction: "359",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:54:56.856Z",
            },
            {
              id: 65,
              journey_id: 1,
              device_id: 17,
              latitude: "2.951011",
              longitude: "101.616885",
              mileage: "24.4",
              speed: "45.6",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:55:00.000Z",
              direction: "359",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:55:13.197Z",
            },
            {
              id: 66,
              journey_id: 1,
              device_id: 17,
              latitude: "2.954184",
              longitude: "101.616859",
              mileage: "24.6",
              speed: "66.5",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:55:20.000Z",
              direction: "0",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:55:27.115Z",
            },
            {
              id: 67,
              journey_id: 1,
              device_id: 17,
              latitude: "2.955717",
              longitude: "101.616853",
              mileage: "24.9",
              speed: "61.4",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:55:30.000Z",
              direction: "0",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:55:41.689Z",
            },
            {
              id: 68,
              journey_id: 1,
              device_id: 17,
              latitude: "2.958306",
              longitude: "101.616951",
              mileage: "25.1",
              speed: "48.3",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:55:50.000Z",
              direction: "9",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:55:56.508Z",
            },
            {
              id: 69,
              journey_id: 1,
              device_id: 17,
              latitude: "2.959492",
              longitude: "101.617198",
              mileage: "25.3",
              speed: "52.9",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:56:00.000Z",
              direction: "16",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:56:11.614Z",
            },
            {
              id: 70,
              journey_id: 2,
              device_id: 17,
              latitude: "2.960957",
              longitude: "101.617499",
              mileage: "25.3",
              speed: "6.8",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:56:20.000Z",
              direction: "3",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:56:26.495Z",
            },
            {
              id: 73,
              journey_id: 2,
              device_id: 17,
              latitude: "2.962497",
              longitude: "101.617439",
              mileage: "25.5",
              speed: "37.2",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:57:00.000Z",
              direction: "340",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:57:11.393Z",
            },
            {
              id: 75,
              journey_id: 2,
              device_id: 17,
              latitude: "2.963084",
              longitude: "101.617124",
              mileage: "25.7",
              speed: "31.5",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:57:30.000Z",
              direction: "322",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:57:43.093Z",
            },
            {
              id: 76,
              journey_id: 2,
              device_id: 17,
              latitude: "2.965377",
              longitude: "101.615465",
              mileage: "25.9",
              speed: "63.6",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:57:50.000Z",
              direction: "319",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:57:51.932Z",
            },
            {
              id: 77,
              journey_id: 2,
              device_id: 17,
              latitude: "2.965496",
              longitude: "101.615357",
              mileage: "25.9",
              speed: "63.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:57:51.000Z",
              direction: "316",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:57:52.912Z",
            },
            {
              id: 78,
              journey_id: 2,
              device_id: 17,
              latitude: "2.966444",
              longitude: "101.614492",
              mileage: "26.2",
              speed: "53.9",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:58:00.000Z",
              direction: "328",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:58:14.834Z",
            },
            {
              id: 80,
              journey_id: 2,
              device_id: 17,
              latitude: "2.968568",
              longitude: "101.613734",
              mileage: "26.3",
              speed: "3.2",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:58:20.000Z",
              direction: "340",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:58:26.489Z",
            },
            {
              id: 79,
              journey_id: 2,
              device_id: 17,
              latitude: "2.96857",
              longitude: "101.613733",
              mileage: "26.3",
              speed: "0.1",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:58:21.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T03:58:24.567Z",
            },
            {
              id: 82,
              journey_id: 2,
              device_id: 17,
              latitude: "2.968758",
              longitude: "101.613483",
              mileage: "26.4",
              speed: "5.5",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:58:49.000Z",
              direction: "284",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:58:57.557Z",
            },
            {
              id: 83,
              journey_id: 1,
              device_id: 17,
              latitude: "2.969332",
              longitude: "101.613191",
              mileage: "26.5",
              speed: "46.7",
              gps_accuracy: "1",
              gps_time: "2023-08-26T03:58:59.000Z",
              direction: "339",
              is_alarm: false,
              command_type_id: 11,
              createdAt: "2023-08-26T03:59:10.973Z",
            },
            {
              id: 84,
              journey_id: 1,
              device_id: 17,
              latitude: "2.970362",
              longitude: "101.612820",
              mileage: "26.5",
              speed: "28.1",
              gps_accuracy: "0",
              gps_time: "2023-08-26T03:59:09.000Z",
              direction: "338",
              is_alarm: true,
              command_type_id: 7,
              createdAt: "2023-08-26T03:59:12.214Z",
            },
            {
              id: 85,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:03:36.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 4,
              createdAt: "2023-08-26T04:03:39.555Z",
            },
            {
              id: 86,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:03:42.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:03:44.292Z",
            },
            {
              id: 87,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.4",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:05:18.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:05:20.690Z",
            },
            {
              id: 88,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:07:39.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:07:40.253Z",
            },
            {
              id: 89,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:08:09.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:08:10.555Z",
            },
            {
              id: 90,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:09:00.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:09:03.456Z",
            },
            {
              id: 92,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:10:12.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:10:16.171Z",
            },
            {
              id: 93,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:10:51.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:10:55.362Z",
            },
            {
              id: 94,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:13:27.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:13:28.214Z",
            },
            {
              id: 95,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.3",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:13:42.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:13:43.796Z",
            },
            {
              id: 96,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:14:03.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:14:04.251Z",
            },
            {
              id: 97,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:14:39.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:14:43.157Z",
            },
            {
              id: 98,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:15:03.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:15:06.632Z",
            },
            {
              id: 99,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:16:06.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:16:08.269Z",
            },
            {
              id: 101,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:19:21.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:19:22.803Z",
            },
            {
              id: 102,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:23:12.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:23:13.193Z",
            },
            {
              id: 103,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:25:48.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 6,
              createdAt: "2023-08-26T04:25:49.675Z",
            },
            {
              id: 104,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970357",
              longitude: "101.609639",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:25:48.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 3,
              createdAt: "2023-08-26T04:25:52.790Z",
            },
            {
              id: 106,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970037",
              longitude: "101.609633",
              mileage: "26.5",
              speed: "0.6",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:25:54.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:25:56.690Z",
            },
            {
              id: 108,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970037",
              longitude: "101.609633",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:26:18.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:26:20.371Z",
            },
            {
              id: 111,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970037",
              longitude: "101.609633",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:26:45.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:26:47.212Z",
            },
            {
              id: 115,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970037",
              longitude: "101.609633",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:27:21.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:27:23.325Z",
            },
            {
              id: 118,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970037",
              longitude: "101.609633",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:28:03.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 31,
              createdAt: "2023-08-26T04:28:06.391Z",
            },
            {
              id: 121,
              journey_id: 4,
              device_id: 17,
              latitude: "2.970037",
              longitude: "101.609633",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:28:30.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 7,
              createdAt: "2023-08-26T04:28:33.470Z",
            },
            {
              id: 122,
              journey_id: 3,
              device_id: 17,
              latitude: "2.970037",
              longitude: "101.609633",
              mileage: "26.5",
              speed: "0.0",
              gps_accuracy: "0",
              gps_time: "2023-08-26T04:28:30.000Z",
              direction: "341",
              is_alarm: true,
              command_type_id: 4,
              createdAt: "2023-08-26T04:28:37.311Z",
            },
          ];
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
                  //TODO - see if need to change to complete trip details
                  coords: state.selectedTripLine,
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
