import { Image, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { colors, theme } from "@theme";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { images } from "@markers";

const ViewPoiOnMap: React.FC<ProfileSettingsStackScreenProps<"ViewPoiOnMap">> = ({ route }) => {
  const { _id, item } = route.params;
  const mapRef = React.useRef<MapView>(null);
  const [_isMapReady, setIsMapReady] = React.useState<boolean>(false);

  const fitCoordinates = React.useCallback(() => {
    if (!mapRef.current || !item) {
      return;
    }
    mapRef.current?.fitToCoordinates([item], {
      animated: true,
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
  }, [mapRef, item]);

  const handleMarkerOnPress = React.useCallback((coords: CoordinatesType) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      zoom: 12,
    });
  }, []);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: item.latitude,
          longitude: item.longitude,
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
      >
        <Marker
          key={_id}
          pinColor={colors.info}
          tracksViewChanges={false}
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
          centerOffset={{ x: 0, y: -18 }}
          title={item.name}
          onPress={() => handleMarkerOnPress(item)}
        >
          <Image
            source={images[`${item.iconName}-${item.color}`]}
            // onLoad={() => setViewTrackingA1(false)}
            style={{ width: 48, height: 48 }}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </SafeAreaView>
  );
};

export { ViewPoiOnMap };
