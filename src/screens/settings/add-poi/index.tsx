import type { ImageRequireSource } from "react-native";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { NoIconHeader, _Divider, _ScrollFormLayout, _TextInput } from "@components";
import type { LatLng } from "react-native-maps";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { PaperTheme, colors, gStyles } from "@theme";
import { Button, Modal, Portal } from "react-native-paper";
import type { FormikHelpers } from "formik";
import { useFormik } from "formik";
import * as yup from "yup";
//@ts-ignore
import WarehouseInfo from "../../../assets/images/markers/warehouse-info.png";
//@ts-ignore
import WarehousePrimary from "../../../assets/images/markers/warehouse-primary.png";
//@ts-ignore
import WarehouseError from "../../../assets/images/markers/warehouse-error.png";
//@ts-ignore
import WarehouseWarning from "../../../assets/images/markers/warehouse-warning.png";
//@ts-ignore
import ParkingInfo from "../../../assets/images/markers/parking-info.png";
//@ts-ignore
import ParkingPrimary from "../../../assets/images/markers/parking-primary.png";
//@ts-ignore
import ParkingError from "../../../assets/images/markers/parking-error.png";
//@ts-ignore
import ParkingWarning from "../../../assets/images/markers/parking-warning.png";

import { styles } from "./styles";
import { ToastService } from "@utility";
import { MaterialIcons } from "@expo/vector-icons";

const images: Record<string, ImageRequireSource> = {
  "warehouse-info": WarehouseInfo,
  "warehouse-primary": WarehousePrimary,
  "warehouse-error": WarehouseError,
  "warehouse-warning": WarehouseWarning,
  "parking-info": ParkingInfo,
  "parking-primary": ParkingPrimary,
  "parking-error": ParkingError,
  "parking-warning": ParkingWarning,
};
const iconColors: Record<string, string> = {
  primary: colors.primary,
  info: colors.info,
  error: colors.error,
  warning: colors.warning,
};
const iconNames: Record<string, string> = {
  warehouse: "warehouse",
  parking: "parking",
};
interface Marker extends LatLng {
  name: string;
  iconName: string;
  color: string;
}
interface IForm {
  name: string;
  iconName: string;
  color: string;
  colorName: string;
}
const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Name is required"),
  iconName: yup.string().required("Icon is required"),
  color: yup.string().required("Color is required"),
  colorName: yup.string().required("Color is required"),
});

//------------------Component------------------------------------------------
const AddPoi: React.FC<ProfileSettingsStackScreenProps<"AddPoi">> = ({}) => {
  const [location, _setLocation] = React.useState({
    latitude: 3.139003,
    longitude: 101.686855,
    name: "Placeholder",
  });
  const mapRef = React.useRef<MapView>(null);
  const [_isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const [poiMarkers, setPoiMarkers] = React.useState<Marker[]>([]);
  const [newMarker, setNewMarker] = React.useState<LatLng | undefined>();
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const fitCoordinates = React.useCallback(() => {
    if (!mapRef.current || !location) {
      return;
    }
    mapRef.current?.fitToCoordinates([location], {
      animated: true,
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
  }, [mapRef, location]);

  const handleMarkerOnPress = React.useCallback((coords: CoordinatesType) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      zoom: 12,
    });
  }, []);

  const addMarker = (values: IForm, helpers: FormikHelpers<IForm>) => {
    if (newMarker !== undefined) {
      setPoiMarkers((prev) => [
        ...prev,
        {
          latitude: newMarker.latitude,
          longitude: newMarker.longitude,
          name: values.name,
          color: values.colorName,
          iconName: values.iconName,
        },
      ]);
    }
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
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      addMarker(values, helpers);
    },
    validationSchema: schema,
  });

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader title="Add POI" />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        zoomEnabled={true}
        rotateEnabled={false}
        showsCompass={Platform.OS === "ios"}
        zoomTapEnabled={false}
        zoomControlEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        onMapLoaded={() => setIsMapReady(true)}
        onMapReady={() => fitCoordinates()}
        onDoublePress={(e) => {
          e.preventDefault();
          console.log("double tapped", e.nativeEvent?.coordinate);
          const markerCord = e.nativeEvent?.coordinate;
          setNewMarker((prev) => {
            console.log("previous newMarker", prev);
            return markerCord;
          });
          showDialog();
        }}
      >
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
            onPress={() => handleMarkerOnPress(location)}
          >
            <Image
              source={images[`${value.iconName}-${value.color}`]}
              // onLoad={() => setViewTrackingA1(false)}
              // style={{ width: 35, height: 35 }}
              resizeMethod="auto"
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>
      <Portal theme={PaperTheme}>
        <Modal visible={visible} onDismiss={hideDialog} contentContainerStyle={styles.modalContent}>
          <_ScrollFormLayout hasSpacing={false}>
            <View>
              <Text style={gStyles.headerText}>New POI</Text>
              <_TextInput
                label={"Name"}
                placeholder="Enter name for POI"
                value={form.values.name}
                onChangeText={form.handleChange("name")}
                onBlur={form.handleBlur("name")}
                errorText={form.errors.name || form.errors.color || form.errors.iconName}
                error={!!form.errors.name && form.touched.name}
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
                        style={{ width: 28, height: 28 }}
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
                      style={StyleSheet.compose(styles.colorButton, { backgroundColor: value[1] })}
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
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export { AddPoi };
