/* eslint-disable camelcase */
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import type { LatLng } from "react-native-maps";
import type { FormikHelpers } from "formik";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { Button, Portal, RadioButton } from "react-native-paper";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastService } from "@utility";
import {
  _Divider,
  _DropDown,
  _ScrollFormLayout,
  _TextInput,
} from "@components";
import { MaterialIcons } from "@expo/vector-icons";
import { images, oldIconNames, oldIconColors } from "@markers";
import { addPoi, getPoiList, reverseGeocode } from "@services";
import { useAuthContext } from "@context";
import Spinner from "react-native-loading-spinner-overlay";
import { mapMarkers } from "@map-markers";
import { useSafeAreaDimensions } from "@hooks";

import { styles } from "./styles";
interface Marker extends LatLng {
  name: string;
  iconName: string;
  colorName: string;
  color: string;
  type: string;
  address: string;
}
interface IForm {
  name: string;
  iconName: string;
  color: string;
  colorName: string;
  latitude: number;
  longitude: number;
  poiType: string;
  address: string;
}
const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Name is required"),
  iconName: yup.string().required("Icon is required"),
  color: yup.string().required("Color is required"),
  colorName: yup.string().required("Color is required"),
  latitude: yup.number().required("Latitude is required"),
  longitude: yup.number().required("Longitude is required"),
  poiType: yup.string().required("POI Type is required"),
  address: yup.string().required("Address is required"),
});
//------------------Component------------------------------------------------
const BirdEyeView: React.FC<ForkliftStackScreenProps<"BirdEyeView">> = ({
  route,
}) => {
  const {
    state: { token, isAdmin },
  } = useAuthContext();
  const { LATITUDE_DELTA, LONGITUDE_DELTA } = useSafeAreaDimensions();
  // const { SCREEN_HEIGHT } = useSafeAreaDimensions();
  const { mode } = route.params;
  const mapRef = React.useRef<MapView>(null);
  const [trackViewChanges, _setTrackViewChanges] =
    React.useState<boolean>(true);
  const [_isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const [markers, setMarkers] = React.useState<IMapPoint[]>([]);
  const [poiMarkers, setPoiMarkers] = React.useState<Marker[]>([]);
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchAddress, setFetchAddress] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleMarkerOnPress = React.useCallback((coords: CoordinatesType) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  }, []);

  const fitCoordinates = React.useCallback(() => {
    if (!mapRef.current || markers.length === 0) {
      return;
    }
    mapRef.current?.fitToCoordinates(markers, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
      animated: true,
    });
  }, [mapRef, markers]);

  const addMarker = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    console.log("inside addMarker");
    addPoi(token, {
      address: values.address,
      marker_shape: values.iconName,
      color: values.colorName,
      latitude: values.latitude.toString(),
      longitude: values.longitude.toString(),
      poi_name: values.name,
      poi_type: parseInt(values.poiType, 10),
      company_name: "company_name",
      company_id: "company_id",
      person: "person",
      phone_no: "0123456",
      mobile_no: "0123456",
      email: "person@example.com",
      // zone_id: 3,
    })
      .then((res) => {
        console.log(res);
        ToastService.show(res?.message || "");
        if (res.success) {
          helpers.resetForm();
          hideDialog();
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred!");
      })
      .finally(() => {
        setIsLoading(false);
        fetchPois();
      });
  };

  const form = useFormik<IForm>({
    initialValues: {
      color: colors.primary,
      iconName: "building",
      name: "",
      colorName: "black",
      latitude: 0,
      longitude: 0,
      poiType: "1",
      address: "",
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      console.log("before addMarker");
      addMarker(values, helpers);
    },
    validationSchema: schema,
  });

  React.useEffect(() => {
    if (mode === "single") {
      const { point } = route.params;
      setMarkers([point]);
    } else if (mode === "multiple") {
      setMarkers(route.params.points);
    }
  }, [mode, route.params]);

  React.useEffect(() => {
    if (!fetchAddress) {
      return;
    }
    reverseGeocode({ lat: form.values.latitude, lng: form.values.longitude })
      .then((res) => {
        console.log("returned response =>", res);
        setFetchAddress(false);
        if (res.length > 0) {
          form.setValues((prev) => ({
            ...prev,
            address: res[0].address,
          }));
        } else {
          ToastService.show("No address found");
        }
      })
      .catch((_err) => {
        ToastService.show("Error fetching Addresses");
      })
      .finally(() => {
        setFetchAddress(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAddress]);

  const fetchPois = React.useCallback(() => {
    getPoiList(token)
      .then((res) => {
        if (res.success) {
          const pois: Marker[] = res.data.rows.map((poi) => ({
            latitude: parseFloat(poi.latitude),
            longitude: parseFloat(poi.longitude),
            name: poi.poi_name,
            colorName: poi.color,
            iconName: poi.marker_shape,
            type: poi.poi_type === 1 ? "private" : "public",
            address: poi.address,
            color: oldIconColors[poi.color],
          }));
          setPoiMarkers((_prev) => pois);
        }
      })
      .catch((_err) => {
        ToastService.show("POI Error occurred");
      });
  }, [token]);

  React.useEffect(() => {
    fetchPois();
  }, [fetchPois]);

  console.log(form.errors);

  const renderedMarkers = poiMarkers.map((value, index) => (
    <Marker
      key={index}
      pinColor={colors.info}
      tracksViewChanges={false}
      coordinate={{
        latitude: value.latitude,
        longitude: value.longitude,
      }}
      title={value.name}
      centerOffset={{ x: 0, y: -18 }}
      onPress={() => handleMarkerOnPress(value)}
    >
      <Image
        source={images[`${value.iconName}-${value.colorName}`]}
        style={{
          width: theme.img.size.sm.width,
          height: theme.img.size.sm.height,
        }}
        resizeMethod="auto"
        resizeMode="contain"
      />
    </Marker>
  ));

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
      <View style={{ height: theme.header.height }} />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        toolbarEnabled={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={false}
        zoomTapEnabled={false}
        onMapLoaded={() => setIsMapReady(true)}
        onMapReady={() => fitCoordinates()}
        initialRegion={
          markers.length > 0
            ? {
                latitude: markers[0].latitude,
                longitude: markers[0].longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            : {
                latitude: 3.1357,
                longitude: 101.688,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
        }
        onDoublePress={
          isAdmin
            ? (e) => {
                e.preventDefault();
                console.log("double tapped", e.nativeEvent?.coordinate);
                const markerCord = e.nativeEvent?.coordinate;
                form.setValues((prev) => ({
                  ...prev,
                  latitude: markerCord.latitude,
                  longitude: markerCord.longitude,
                }));
                showDialog();
                setFetchAddress(true);
              }
            : undefined
        }
      >
        {markers.map((marker, index) => (
          <React.Fragment key={index}>
            {mapMarkers[marker.icon] ? (
              <Marker
                key={index}
                tracksViewChanges={trackViewChanges}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
                onPress={() => handleMarkerOnPress(marker)}
              >
                <Image
                  source={mapMarkers[marker.icon].icon}
                  // onLoad={() => setViewTrackingA1(false)}
                  style={{
                    width: mapMarkers[marker.icon].size.width,
                    height: mapMarkers[marker.icon].size.height,
                  }}
                  resizeMethod="auto"
                  resizeMode="contain"
                />
              </Marker>
            ) : (
              <Marker
                key={index}
                tracksViewChanges={trackViewChanges}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
                onPress={() => handleMarkerOnPress(marker)}
              />
            )}
          </React.Fragment>
        ))}
        {renderedMarkers}
      </MapView>
      <Portal theme={PaperTheme}>
        <Modal
          visible={visible}
          onDismiss={hideDialog}
          style={styles.modalContent}
          presentationStyle={"overFullScreen"}
        >
          <SafeAreaView style={screenStyles.mainContainer}>
            <_ScrollFormLayout hasSpacing={true}>
              <View style={{ gap: theme.spacing.sm }}>
                <Text style={gStyles.headerText}>Add POI</Text>
                <_Divider title="Type" />
                <RadioButton.Group
                  onValueChange={(value) =>
                    form.setValues((prev) => ({ ...prev, poiType: value }))
                  }
                  value={form.values.poiType}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={StyleSheet.compose(screenStyles.radioItemStyle, {
                        flex: 1,
                      })}
                    >
                      <RadioButton.Item
                        theme={PaperTheme}
                        label="Private"
                        value="1"
                        color={colors.primary}
                        uncheckedColor={colors.iconGray}
                        labelStyle={gStyles.descText}
                      />
                    </View>
                    <View
                      style={StyleSheet.compose(screenStyles.radioItemStyle, {
                        flex: 1,
                      })}
                    >
                      <RadioButton.Item
                        theme={PaperTheme}
                        label="Business"
                        value="2"
                        color={colors.primary}
                        uncheckedColor={colors.iconGray}
                        labelStyle={gStyles.descText}
                      />
                    </View>
                  </View>
                </RadioButton.Group>
                <_Divider title="Info" />
                <_TextInput
                  label={"Name"}
                  placeholder="Enter name for POI"
                  value={form.values.name}
                  onChangeText={form.handleChange("name")}
                  onBlur={form.handleBlur("name")}
                  errorText={
                    form.errors.name ||
                    form.errors.color ||
                    form.errors.iconName
                  }
                  error={!!form.errors.name && form.touched.name}
                />
                <_TextInput
                  label={"Latitude"}
                  editable={false}
                  value={form.values.latitude.toString()}
                  errorText={""}
                />
                <_TextInput
                  label={"Longitude"}
                  editable={false}
                  value={form.values.longitude.toString()}
                  errorText={""}
                />
                <_TextInput
                  multiline={true}
                  numberOfLines={4}
                  label={"Address"}
                  value={form.values.address}
                  onChangeText={form.handleChange("address")}
                  onBlur={form.handleBlur("address")}
                  errorText={form.errors.address}
                  error={!!form.errors.address && form.touched.address}
                />

                <_Divider title="Icon" />
                <View style={styles.arrMappingContainer}>
                  {Object.entries(oldIconNames).map((value, index) => {
                    console.log(value);
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          form.setValues((prev) => ({
                            ...prev,
                            iconName: value[1],
                          }))
                        }
                        activeOpacity={0.7}
                      >
                        <Image
                          source={
                            images[`${value[1]}-${form.values.colorName}`]
                          }
                          // onLoad={() => setViewTrackingA1(false)}
                          style={{
                            width: theme.img.size.xs.width,
                            height: theme.img.size.xs.height,
                          }}
                          resizeMethod="auto"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <_Divider title="Color" />
                <View style={styles.arrMappingContainer}>
                  {Object.entries(oldIconColors).map((value, index) => {
                    const checked = value[1] === form.values.color;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          form.setValues((prev) => ({
                            ...prev,
                            color: value[1],
                            colorName: value[0],
                          }))
                        }
                        activeOpacity={0.7}
                        style={StyleSheet.compose(styles.colorButton, {
                          backgroundColor: value[1],
                        })}
                      >
                        {checked && (
                          <MaterialIcons
                            name="check"
                            size={20}
                            color={colors.white}
                            // style={{ opacity: 0.7 }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={screenStyles.formSubmitButtonContainer}>
                  <Button
                    onPress={() => {
                      hideDialog();
                      form.resetForm();
                      setFetchAddress(false);
                    }}
                    theme={PaperTheme}
                    mode="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => form.handleSubmit()}
                    mode="contained"
                    theme={PaperTheme}
                  >
                    Done
                  </Button>
                </View>
              </View>
            </_ScrollFormLayout>
          </SafeAreaView>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export { BirdEyeView };
