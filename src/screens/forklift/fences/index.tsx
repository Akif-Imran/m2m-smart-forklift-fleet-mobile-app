/* eslint-disable camelcase */
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { listCardStyles, mapStyles, screenStyles } from "@screen-styles";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import type { Details, LatLng, MapPressEvent, Region } from "react-native-maps";
import MapView, { Circle, PROVIDER_DEFAULT, Polygon } from "react-native-maps";
import Slider from "@react-native-community/slider";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import { ToastService } from "@utility";
import type { RightSheetRefProps } from "@components";
import {
  RIGHT_SHEET_MAX_TRANSLATE_X,
  RIGHT_SHEET_MIN_TRANSLATE_X,
  _ConfirmModal,
  _DefaultCard,
  _Divider,
  _RightSheet,
  _ScrollFormLayout,
} from "@components";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY, GOOGLE_PLACES_API } from "@api";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { useSafeAreaDimensions } from "@hooks";
import {
  createGeoFence,
  deleteGeoFence,
  getGeoFenceByDeviceId,
  updateGeoFence,
} from "@services";
import { useAuthContext } from "@context";

import { styles } from "./styles";

interface ICircle {
  id: number;
  center: LatLng;
  radius: number;
  name: string;
}
interface IPolygon {
  id: number;
  points: LatLng[];
  name: string;
}

const Fences: React.FC<ForkliftStackScreenProps<"Fences">> = ({ route }) => {
  const { item } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const {
    TOP_INSET,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
  } = useSafeAreaDimensions();

  const ANDROID_OFFSET = TOP_INSET;
  const IOS_OFFSET = 16;
  const IMAGE_SIZE = 56;
  const PIN_OFFSET =
    Platform.OS === "ios"
      ? IMAGE_SIZE + IOS_OFFSET
      : IMAGE_SIZE + ANDROID_OFFSET;

  const mapRef = React.useRef<MapView>(null);
  const rightSheetRef = React.useRef<RightSheetRefProps>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [placeId, setPlaceId] = React.useState("");
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [controlMode, setControlMode] = React.useState<
    "circle" | "poly" | "search" | "default"
  >("default");
  const [radius, setRadius] = React.useState(1);
  const [polygonPoints, setPolygonPoints] = React.useState<LatLng[]>([]);
  const [polygons, setPolygons] = React.useState<IPolygon[]>([]);
  const [circles, setCircles] = React.useState<ICircle[]>([]);
  const [_searchedLocation, setSearchedLocation] =
    React.useState<LatLng>(region);
  const [fenceMode, setFenceMode] = React.useState<"add" | "edit">("add");
  const [selectedFenceId, setSelectedFenceId] = React.useState<number>(0);
  const [toBeDeletedFenceId, setToBeDeletedFenceId] = React.useState<number>(0);
  const [name, setName] = React.useState("");

  const openMenu = () =>
    rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MAX_TRANSLATE_X);
  const closeMenu = () =>
    rightSheetRef?.current?.scrollTo(RIGHT_SHEET_MIN_TRANSLATE_X);

  const addFence = (
    type: "poly" | "circle",
    currentFenceMode: "add" | "edit"
  ) => {
    if (name === "") {
      ToastService.show("Please enter fence name");
      return;
    }
    setIsLoading(true);
    setControlMode("default");
    if (type === "poly") {
      if (currentFenceMode === "add") {
        setPolygons((prev) => {
          const newArray = [
            ...prev,
            {
              points: polygonPoints,
              name: name,
              id: faker.number.int({ min: 1, max: 100000 }),
            },
          ];
          return newArray;
        });
        setPolygonPoints([]);
      } else {
        setPolygons((prev) => {
          const newArray = [...prev];
          const index = newArray.findIndex(
            (poly) => poly.id === selectedFenceId
          );
          newArray[index].points = polygonPoints;
          newArray[index].name = name;
          return newArray;
        });
        setPolygonPoints([]);
        setFenceMode("add");
      }
    }
    if (type === "circle") {
      if (currentFenceMode === "add") {
        addGeoFence();
      } else {
        editGeoFence();
      }
    }
  };

  const editCircle = (circle: ICircle) => {
    setFenceMode("edit");
    setSelectedFenceId(circle.id);
    closeMenu();
    setRadius(circle.radius);
    setName(circle.name);
    setControlMode("circle");
    //TODO - extract method just so i have to pass lat lng only
    mapRef.current?.animateCamera({
      center: {
        latitude: circle.center.latitude,
        longitude: circle.center.longitude,
      },
    });
  };

  const editPoly = (poly: IPolygon) => {
    setFenceMode("edit");
    setSelectedFenceId(poly.id);
    closeMenu();
    mapRef.current?.fitToCoordinates(poly.points, {
      animated: true,
      edgePadding: {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80,
      },
    });
    setPolygonPoints(poly.points);
    setName(poly.name);
    setControlMode("poly");
  };

  const handleDelete = React.useCallback((fenceId: number) => {
    setToBeDeletedFenceId(fenceId);
    setConfirmDeleteVisible(true);
    console.log("handle delete", fenceId);
  }, []);

  const handleDeleteConfirm = () => {
    removeGeoFence();
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

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

  const handleOnRegionChangeComplete = (
    newRegion: Region,
    details: Details
  ) => {
    setRegion(newRegion);
    console.log(newRegion, details);
  };

  const reset = () => {
    setControlMode("default");
    setFenceMode("add");
    setSelectedFenceId(0);
    setRadius(1);
    setName("");
  };

  const fitToCoordinates = (points: LatLng[], padding = 80) => {
    mapRef?.current?.fitToCoordinates(points, {
      animated: true,
      edgePadding: {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding,
      },
    });
  };

  const addGeoFence = () => {
    setIsLoading(true);
    createGeoFence(token, {
      device_id: item.device_id,
      display_name: name,
      latitude: region.latitude.toString(),
      longitude: region.longitude.toString(),
      radius: radius.toString(),
    })
      .then((res) => {
        ToastService.show(res?.message || "");
        if (res.success) {
          reset();
          fetchGeoFences();
        }
      })
      .catch((_err) => {
        console.log(_err?.message);
        ToastService.show("Add fence error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editGeoFence = () => {
    setIsLoading(true);
    updateGeoFence(token, {
      id: selectedFenceId,
      display_name: name,
      latitude: region.latitude.toString(),
      longitude: region.longitude.toString(),
      radius: radius.toString(),
    })
      .then((res) => {
        ToastService.show(res?.message || "");
        if (res.success) {
          reset();
          fetchGeoFences();
        }
      })
      .catch((_err) => {
        console.log(_err?.message);
        ToastService.show("Add fence error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeGeoFence = () => {
    setConfirmDeleteVisible(false);
    setIsLoading(true);
    deleteGeoFence(token, toBeDeletedFenceId.toString())
      .then((res) => {
        ToastService.show(res?.message || "");
        if (res.success) {
          fetchGeoFences();
        }
      })
      .catch((_err) => {
        ToastService.show("Delete fence error");
        console.log(_err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchGeoFences = React.useCallback(() => {
    getGeoFenceByDeviceId(token, item.device_id.toString()).then((res) => {
      if (res.success) {
        const circlesList: ICircle[] = res.data.rows.map((value) => ({
          id: value.id,
          center: {
            latitude: parseFloat(value.latitude),
            longitude: parseFloat(value.longitude),
          },
          name: value.display_name,
          radius: parseFloat(value.radius),
        }));
        setCircles(circlesList);
      }
    });
  }, [token, item.device_id]);

  React.useEffect(() => {
    if (!placeId) {
      return;
    }
    axios
      .get(
        `${GOOGLE_PLACES_API}/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("place details", res.data.result.geometry.location);
          const { lat } = res.data.result.geometry.location;
          const { lng } = res.data.result.geometry.location;
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
  }, [placeId, LONGITUDE_DELTA, LATITUDE_DELTA]);

  React.useEffect(() => {
    if (!token) {
      return;
    }
    fetchGeoFences();
  }, [token, fetchGeoFences]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
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
        {polygons.map((polygon, _index) => {
          if (fenceMode === "edit") {
            if (polygon.id !== selectedFenceId) {
              return (
                <Polygon
                  coordinates={polygon.points}
                  fillColor={colors.titleTextTransparent60}
                  strokeWidth={0.01}
                  key={polygon.id}
                />
              );
            } else {
              return null;
            }
          } else {
            return (
              <Polygon
                coordinates={polygon.points}
                fillColor={colors.secondaryTransparent60}
                strokeWidth={0.01}
                key={polygon.id}
              />
            );
          }
        })}
        {circles.map((circle) => {
          if (fenceMode === "edit") {
            if (circle.id !== selectedFenceId) {
              return (
                <Circle
                  key={circle.id}
                  center={circle.center}
                  radius={circle.radius}
                  fillColor={colors.titleTextTransparent60}
                  strokeWidth={0.01}
                />
              );
            } else {
              return null;
            }
          } else {
            return (
              <Circle
                key={circle.id}
                center={circle.center}
                radius={circle.radius}
                fillColor={colors.secondaryTransparent60}
                strokeWidth={0.01}
              />
            );
          }
        })}

        {controlMode === "circle" && (
          <Circle
            center={region}
            radius={radius}
            fillColor={colors.secondaryTransparent60}
            strokeWidth={0.01}
          />
        )}
        {controlMode === "poly" && polygonPoints.length >= 3 && (
          <Polygon
            coordinates={polygonPoints}
            fillColor={colors.secondaryTransparent60}
            strokeWidth={0.01}
          />
        )}
      </MapView>
      {controlMode === "default" && (
        <View style={mapStyles.defaultControls} pointerEvents="box-none">
          <View style={{ gap: theme.spacing.sm }}>
            <TouchableOpacity
              style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
              onPress={() => openMenu()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="ios-list-outline"
                size={24}
                color={colors.iconGray}
              />
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
              <MaterialCommunityIcons
                name="shape-circle-plus"
                size={24}
                color={colors.iconGray}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
              onPress={() => setControlMode("poly")}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="shape-polygon-plus"
                size={24}
                color={colors.iconGray}
              />
            </TouchableOpacity> */}
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
                    borderRadius: theme.radius.md,
                  },
                  separator: {
                    borderColor: colors.borderColor,
                  },
                }}
                placeholder="Enter Location"
                onPress={(_data, details) => {
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
                <Ionicons
                  name="ios-close-outline"
                  size={24}
                  color={colors.iconGray}
                />
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
                onPress={() => addFence("circle", fenceMode)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="ios-checkmark"
                  size={24}
                  color={colors.iconGray}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                onPress={() => reset()}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="ios-close-outline"
                  size={24}
                  color={colors.iconGray}
                />
              </TouchableOpacity>
            </View>
            <View>
              <View style={[styles.sliderContainer, screenStyles.shadow]}>
                <Slider
                  step={1}
                  value={radius}
                  style={styles.sliderHeight}
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
                onPress={() => addFence("poly", fenceMode)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="ios-checkmark"
                  size={24}
                  color={colors.iconGray}
                />
              </TouchableOpacity>
              <View style={{ rowGap: theme.spacing.sm }}>
                <TouchableOpacity
                  style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
                  onPress={() => reset()}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="ios-close-outline"
                    size={24}
                    color={colors.iconGray}
                  />
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
                styles.countAlignment,
              ]}
            >
              <Text style={gStyles.cardInfoTitleText}>
                {polygonPoints.length}
              </Text>
            </View>
          </View>
        </>
      )}
      <_RightSheet
        ref={rightSheetRef}
        height={SCREEN_HEIGHT}
        initialPosition="close"
      >
        <SafeAreaView style={screenStyles.mainContainer}>
          <_ScrollFormLayout>
            <View>
              {circles.map((circle, index) => (
                <_DefaultCard
                  key={index}
                  onPress={() => {
                    closeMenu();
                    mapRef?.current?.animateCamera({
                      center: circle.center,
                    });
                  }}
                  onLongPress={() => handleDelete(circle.id)}
                >
                  <View
                    style={StyleSheet.compose(listCardStyles.contentContainer, {
                      backgroundColor: colors.white,
                    })}
                  >
                    <View>
                      <Entypo
                        name="circle"
                        size={32}
                        color={colors.titleText}
                      />
                    </View>
                    <View style={listCardStyles.infoWithForward}>
                      <View style={listCardStyles.infoContainer}>
                        <Text style={gStyles.cardInfoTitleText}>
                          {circle.name}
                        </Text>
                        <Text
                          style={gStyles.tblDescText}
                          ellipsizeMode="tail"
                          numberOfLines={1}
                        >
                          {circle.radius}m
                        </Text>
                      </View>
                      <View style={listCardStyles.forwardContainer}>
                        <TouchableOpacity
                          onPress={() => editCircle(circle)}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons
                            name="pencil"
                            size={20}
                            color={colors.iconGray}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </_DefaultCard>
              ))}
              {polygons.map((poly, index) => (
                <_DefaultCard
                  key={index}
                  onPress={() => {
                    closeMenu();
                    fitToCoordinates(poly.points, 125);
                  }}
                  onLongPress={() => handleDelete(poly.id)}
                >
                  <View
                    style={StyleSheet.compose(listCardStyles.contentContainer, {
                      backgroundColor: colors.white,
                    })}
                  >
                    <View>
                      <Feather
                        name="octagon"
                        size={32}
                        color={colors.titleText}
                      />
                    </View>
                    <View style={listCardStyles.infoWithForward}>
                      <View style={listCardStyles.infoContainer}>
                        <Text style={gStyles.cardInfoTitleText}>
                          {poly.name}
                        </Text>
                        <Text
                          style={gStyles.tblDescText}
                          ellipsizeMode="tail"
                          numberOfLines={1}
                        >
                          {poly.points.length} points
                        </Text>
                      </View>
                      <View style={listCardStyles.forwardContainer}>
                        <TouchableOpacity
                          onPress={() => editPoly(poly)}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons
                            name="pencil"
                            size={20}
                            color={colors.iconGray}
                          />
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
      <_ConfirmModal
        visible={confirmDeleteVisible}
        question="Are you sure you want to delete this fence ?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
};

export { Fences };
