import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import type { LatLng } from "react-native-maps";
import type { FormikHelpers } from "formik";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { Button, Portal, RadioButton } from "react-native-paper";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastService } from "@utility";
import { _Divider, _DropDown, _ScrollFormLayout, _TextInput } from "@components";
import { MaterialIcons } from "@expo/vector-icons";
import { images, iconNames, iconColors } from "@markers";
import { styles } from "./styles";
import { reverseGeocode } from "@services";
interface Marker extends LatLng {
  name: string;
  iconName: string;
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

//------------------Component------------------------------------------------
const BirdEyeView: React.FC<ForkliftStackScreenProps<"BirdEyeView">> = ({ route }) => {
  const { mode } = route.params;
  const mapRef = React.useRef<MapView>(null);
  const [trackViewChanges, _setTrackViewChanges] = React.useState<boolean>(true);
  const [latAdjustment, setLatAdjustment] = React.useState<number>(0);
  const [isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const [markers, _setMarkers] = React.useState<IMapPoint[]>([]);
  const [poiMarkers, setPoiMarkers] = React.useState<Marker[]>([]);
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleMarkerOnPress = React.useCallback(
    (coords: CoordinatesType) => {
      mapRef.current?.animateCamera({
        center: {
          latitude: coords.latitude - latAdjustment,
          longitude: coords.longitude,
        },
      });
    },
    [latAdjustment]
  );

  const calculateDelta = async () => {
    if (!mapRef.current) {
      return;
    }
    const boundingBox = await mapRef.current?.getMapBoundaries();
    const northeastLat = boundingBox?.northEast.latitude;
    const southwestLat = boundingBox?.southWest.latitude;
    const latDelta = northeastLat - southwestLat;
    // const lngDelta = latDelta * ASPECT_RATIO;
    const latAdj = (latDelta / SCREEN_HEIGHT) * SCREEN_HEIGHT * 0.1;
    setLatAdjustment(latAdj);
  };

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
    setPoiMarkers((prev) => [
      ...prev,
      {
        latitude: values.latitude,
        longitude: values.longitude,
        name: values.name,
        color: values.colorName,
        iconName: values.iconName,
        type: values.poiType,
        address: values.address,
      },
    ]);
    helpers.resetForm();
    ToastService.show("Marker added successfully");
    hideDialog();
  };

  const form = useFormik<IForm>({
    initialValues: {
      color: colors.primary,
      iconName: "warehouse",
      name: "",
      colorName: "primary",
      latitude: 0,
      longitude: 0,
      poiType: "private",
      address: "",
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      addMarker(values, helpers);
    },
    validationSchema: schema,
  });

  React.useEffect(() => {
    if (!isMapReady) {
      return;
    }
    calculateDelta().catch((err) => console.error("delta calculate error - CarOnMap", err));
  }, [mapRef, isMapReady]);

  React.useEffect(() => {
    if (mode === "single") {
      const { point } = route.params;
      _setMarkers([point]);
    } else if (mode === "multiple") {
      _setMarkers(route.params.points);
    }
  }, [mode, route.params]);

  React.useEffect(() => {
    if (form.values.latitude === 0 && form.values.longitude === 0) {
      return;
    }
    reverseGeocode({ lat: form.values.latitude, lng: form.values.longitude })
      .then((res) => {
        console.log("returned response =>", res);
        if (res.length > 0) {
          form.setValues((prev) => ({ ...prev, address: res[0].address }));
        } else {
          ToastService.show("No address found");
        }
      })
      .catch((_err) => {
        ToastService.show("Error fetching Addresses");
      });
  }, [form.values.latitude, form.values.longitude]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
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
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
        onDoublePress={(e) => {
          e.preventDefault();
          console.log("double tapped", e.nativeEvent?.coordinate);
          const markerCord = e.nativeEvent?.coordinate;
          form.setValues((prev) => ({
            ...prev,
            latitude: markerCord.latitude,
            longitude: markerCord.longitude,
          }));
          showDialog();
        }}
      >
        {markers.map((marker, index) => (
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
        ))}
        {poiMarkers.map((value, index) => (
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
              source={images[`${value.iconName}-${value.color}`]}
              // onLoad={() => setViewTrackingA1(false)}
              style={{ width: 48, height: 48 }}
              resizeMethod="auto"
              resizeMode="contain"
            />
          </Marker>
        ))}
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
                  onValueChange={(value) => form.setValues((prev) => ({ ...prev, poiType: value }))}
                  value={form.values.poiType}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: theme.spacing.sm,
                    }}
                  >
                    <View style={[screenStyles.radioItemStyle, { flex: 1 }]}>
                      <RadioButton.Item
                        theme={PaperTheme}
                        label="Private"
                        value="private"
                        color={colors.primary}
                        uncheckedColor={colors.iconGray}
                        labelStyle={gStyles.descText}
                      />
                    </View>
                    <View style={[screenStyles.radioItemStyle, { flex: 1 }]}>
                      <RadioButton.Item
                        theme={PaperTheme}
                        label="Business"
                        value="business"
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
                  errorText={form.errors.name || form.errors.color || form.errors.iconName}
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
                  {Object.entries(iconNames).map((value, index) => {
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
                          source={images[`${value[1]}-${form.values.colorName}`]}
                          // onLoad={() => setViewTrackingA1(false)}
                          style={{ width: 35, height: 35 }}
                          resizeMethod="auto"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <_Divider title="Color" />
                <View style={styles.arrMappingContainer}>
                  {Object.entries(iconColors).map((value, index) => {
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
                            style={{ opacity: 0.7 }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={screenStyles.formSubmitButtonContainer}>
                  <Button onPress={hideDialog} theme={PaperTheme} mode="outlined">
                    Cancel
                  </Button>
                  <Button onPress={() => form.handleSubmit()} mode="contained" theme={PaperTheme}>
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
