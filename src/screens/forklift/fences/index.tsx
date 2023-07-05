import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";

import { styles } from "./styles";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { listCardStyles, mapStyles, screenStyles } from "@screen-styles";
import { ForkliftStackScreenProps } from "@navigation-types";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import MapView, {
  Circle,
  Details,
  LatLng,
  MapPressEvent,
  PROVIDER_DEFAULT,
  Polygon,
  Region,
} from "react-native-maps";
import Slider from "@react-native-community/slider";
import { Entypo, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import { ToastService } from "@utility";
import {
  NoIconHeader,
  RIGHT_SHEET_MAX_TRANSLATE_X,
  RIGHT_SHEET_MIN_TRANSLATE_X,
  RightSheetRefProps,
  _DefaultCard,
  _Divider,
  _RightSheet,
  _ScrollFormLayout,
} from "@components";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY, GOOGLE_PLACES_API } from "@api";
import axios from "axios";

interface ICircle {
  center: LatLng;
  radius: number;
  name: string;
}

const Fences: React.FC<ForkliftStackScreenProps<"Fences">> = ({}) => {
  const { top: TOP_INSET } = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const ANDROID_OFFSET = TOP_INSET;
  const IOS_OFFSET = 16;
  const IMAGE_SIZE = 56;
  const PIN_OFFSET = Platform.OS === "ios" ? IMAGE_SIZE + IOS_OFFSET : IMAGE_SIZE + ANDROID_OFFSET;

  const mapRef = React.useRef<MapView>(null);
  const rightSheetRef = React.useRef<RightSheetRefProps>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [placeId, setPlaceId] = React.useState("");
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [controlMode, setControlMode] = React.useState<"circle" | "poly" | "search" | "default">(
    "default"
  );
  const [radius, setRadius] = React.useState(1);
  const [polygonPoints, setPolygonPoints] = React.useState<LatLng[]>([]);
  const [polygons, setPolygons] = React.useState<{ points: LatLng[]; name: string }[]>([]);
  const [circles, setCircles] = React.useState<ICircle[]>([]);
  const [_searchedLocation, setSearchedLocation] = React.useState<LatLng>(region);
  const [name, setName] = React.useState("");

  const openMenu = () => rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MAX_TRANSLATE_X);
  const closeMenu = () => rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MIN_TRANSLATE_X);

  const addFence = (type: "poly" | "circle") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      ToastService.show("Fence added successfully");
      setControlMode("default");
      if (type === "poly") {
        setPolygons((prev) => {
          const newArray = [...prev, { points: polygonPoints, name: name }];
          return newArray;
        });
        setPolygonPoints([]);
      }
      if (type === "circle") {
        setCircles((prev) => {
          const newArray = [...prev, { center: region, radius: radius, name: name }];
          return newArray;
        });
        setRadius(1);
      }
      setName("");
    }, 2000);
  };

  const editCircle = (circle: ICircle) => {
    closeMenu();
    //TODO - extract method just so i have to pass lat lng only
    mapRef.current?.animateToRegion({
      latitude: circle.center.latitude,
      longitude: circle.center.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    setRadius(circle.radius);
    setName(circle.name);
    setControlMode("circle");
  };

  const removeCircle = (circle: ICircle) => {};

  const removePolyPoint = () => {
    setPolygonPoints((prevArray) => {
      const newArray = [...prevArray]; // make a new copy
      newArray.pop(); // remove the last element
      return newArray; // return the new array
    });
    mapRef.current?.animateToRegion(region);
  };

  const handleOnPressMap = (e: MapPressEvent) => {
    const coords = e.nativeEvent.coordinate;
    if (polygonPoints.length < 8) {
      setPolygonPoints((prev) => [...prev, coords]);
    } else {
      ToastService.show("Maximum 8 points allowed");
    }
  };

  const handleOnRegionChangeComplete = (region: Region, details: Details) => {
    setRegion(region);
    console.log(region, details);
  };

  React.useEffect(() => {
    if (!placeId) return;
    axios
      .get(`${GOOGLE_PLACES_API}/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`)
      .then((res) => {
        if (res.status === 200) {
          console.log("place details", res.data.result.geometry.location);
          const lat = res.data.result.geometry.location.lat;
          const lng = res.data.result.geometry.location.lng;
          setSearchedLocation({
            latitude: lat,
            longitude: lng,
          });
          if (mapRef.current) {
            mapRef?.current?.animateToRegion(
              {
                latitude: lat,
                longitude: lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
              500
            );
          }
        }
      })

      .catch((_err) => {
        ToastService.show("place lookup error");
      });
  }, [placeId]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <Spinner visible={isLoading} cancelable={false} animation="fade" size="large" />
      <MapView
        ref={mapRef}
        initialRegion={region}
        mapType="standard"
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        toolbarEnabled={true}
        zoomEnabled={true}
        zoomControlEnabled={false}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={false}
        zoomTapEnabled={false}
        onRegionChangeComplete={handleOnRegionChangeComplete}
        onPress={controlMode === "poly" ? handleOnPressMap : undefined}
      >
        {polygons.map((polygon, index) => (
          <Polygon
            coordinates={polygon.points}
            fillColor={colors.primaryTransparent60}
            strokeWidth={0.01}
            key={index}
          />
        ))}
        {circles.map((circle, index) => (
          <Circle
            key={index}
            center={circle.center}
            radius={circle.radius}
            fillColor={colors.primaryTransparent60}
            strokeWidth={0.01}
          />
        ))}

        {controlMode === "circle" && (
          <Circle
            center={region}
            radius={radius}
            fillColor={colors.primaryTransparent60}
            strokeWidth={0.01}
          />
        )}
        {controlMode === "poly" && (
          <Polygon
            coordinates={polygonPoints}
            fillColor={colors.primaryTransparent60}
            strokeWidth={0.01}
          />
        )}
      </MapView>
      {controlMode === "default" && (
        <View style={styles.defaultControls} pointerEvents="box-none">
          <View style={{ gap: theme.spacing.sm }}>
            <TouchableOpacity
              style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
              onPress={() => openMenu()}
              activeOpacity={0.7}
            >
              <Ionicons name="ios-list-outline" size={24} color={colors.iconGray} />
            </TouchableOpacity>
          </View>
          <View style={{ gap: theme.spacing.sm }}>
            <TouchableOpacity
              style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
              onPress={() => setControlMode("search")}
              activeOpacity={0.7}
            >
              <Octicons name="search" size={24} color={colors.iconGray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
              onPress={() => setControlMode("circle")}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="shape-circle-plus" size={24} color={colors.iconGray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
              onPress={() => setControlMode("poly")}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="shape-polygon-plus" size={24} color={colors.iconGray} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {controlMode === "search" && (
        <>
          <View style={styles.circleControls} pointerEvents="box-none">
            <View style={screenStyles.searchContainer}>
              <GooglePlacesAutocomplete
                styles={{
                  textInput: [
                    gStyles.descText,
                    screenStyles.searchStyle,
                    screenStyles.shadow,
                    { borderRadius: theme.spacing.md, height: 48 },
                  ],
                  row: {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    flex: 1,
                  },
                  description: gStyles.descText,
                  listView: {
                    // borderWidth: 1,
                    borderRadius: theme.radius.md,
                  },
                  separator: {
                    borderColor: colors.borderColor,
                  },
                }}
                placeholder="Enter Location"
                onPress={(data, details) => {
                  if (details?.place_id) {
                    setPlaceId(details?.place_id);
                  } else {
                    ToastService.show("searched place id error");
                  }
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: "en",
                }}
              />
              <TouchableOpacity
                style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                onPress={() => setControlMode("default")}
                activeOpacity={0.7}
              >
                <Ionicons name="ios-close-outline" size={24} color={colors.iconGray} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {controlMode === "circle" && (
        <>
          <View style={styles.circleControls} pointerEvents="box-none">
            <View style={screenStyles.searchContainer}>
              <Searchbar
                theme={PaperTheme}
                autoCapitalize="none"
                value={name}
                icon={"map-marker"}
                placeholder="Name"
                onChangeText={(query) => setName(query)}
                style={[screenStyles.searchStyle, screenStyles.shadow]}
              />
              <TouchableOpacity
                style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                onPress={() => addFence("circle")}
                activeOpacity={0.7}
              >
                <Ionicons name="ios-checkmark" size={24} color={colors.iconGray} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                onPress={() => setControlMode("default")}
                activeOpacity={0.7}
              >
                <Ionicons name="ios-close-outline" size={24} color={colors.iconGray} />
              </TouchableOpacity>
            </View>
            <View>
              <View style={[styles.sliderContainer, screenStyles.shadow]}>
                <Slider
                  step={1}
                  value={radius}
                  style={{ height: 56 }}
                  minimumValue={1}
                  maximumValue={2000}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.iconGray}
                  thumbTintColor={colors.primary}
                  onValueChange={(value) => setRadius(value)}
                />
              </View>
            </View>
          </View>
          <Image
            style={StyleSheet.compose(mapStyles.marker, {
              top: SCREEN_HEIGHT / 2 - PIN_OFFSET,
              left: SCREEN_WIDTH / 2 - IMAGE_SIZE / 2,
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
            })}
            source={require("../../../assets/images/icons8-location-96.png")}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </>
      )}
      {controlMode === "poly" && (
        <>
          <View style={styles.circleControls} pointerEvents="box-none">
            <View style={screenStyles.searchContainer} pointerEvents="box-none">
              <Searchbar
                theme={PaperTheme}
                autoCapitalize="none"
                value={name}
                icon={"map-marker"}
                placeholder="Name"
                onChangeText={(query) => setName(query)}
                style={[screenStyles.searchStyle, screenStyles.shadow]}
              />
              <TouchableOpacity
                style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                onPress={() => addFence("poly")}
                activeOpacity={0.7}
              >
                <Ionicons name="ios-checkmark" size={24} color={colors.iconGray} />
              </TouchableOpacity>
              <View style={{ rowGap: theme.spacing.sm }}>
                <TouchableOpacity
                  style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                  onPress={() => setControlMode("default")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="ios-close-outline" size={24} color={colors.iconGray} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                  onPress={() => removePolyPoint()}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="vector-polyline-minus"
                    size={24}
                    color={colors.iconGray}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                screenStyles.filterButtonStyle,
                screenStyles.shadow,
                { alignSelf: "center", minWidth: 48 },
              ]}
            >
              <Text style={gStyles.cardInfoTitleText}>{polygonPoints.length}</Text>
            </View>
          </View>
        </>
      )}
      <_RightSheet ref={rightSheetRef} height={SCREEN_HEIGHT} initialPosition="close">
        <SafeAreaView style={screenStyles.mainContainer}>
          <_ScrollFormLayout>
            <View>
              {circles.map((circle, index) => (
                <_DefaultCard
                  key={index}
                  onPress={() => {}}
                  onLongPress={() => removeCircle(circle)}
                >
                  <View
                    style={StyleSheet.compose(listCardStyles.contentContainer, {
                      backgroundColor: colors.white,
                    })}
                  >
                    <View>
                      <Entypo name="circle" size={32} color={colors.titleText} />
                    </View>
                    <View style={listCardStyles.infoWithForward}>
                      <View style={listCardStyles.infoContainer}>
                        <Text style={gStyles.cardInfoTitleText}>{circle.name}</Text>
                        <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
                          {circle.radius}m
                        </Text>
                      </View>
                      <View style={listCardStyles.forwardContainer}>
                        <TouchableOpacity onPress={() => editCircle(circle)} activeOpacity={0.7}>
                          <MaterialCommunityIcons name="pencil" size={20} color={colors.iconGray} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </_DefaultCard>
              ))}
            </View>
          </_ScrollFormLayout>
        </SafeAreaView>
      </_RightSheet>
    </SafeAreaView>
  );
};

export { Fences };
