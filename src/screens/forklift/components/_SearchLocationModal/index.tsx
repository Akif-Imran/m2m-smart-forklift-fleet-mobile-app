import { Modal, TouchableOpacity, View } from "react-native";
import React from "react";
import axios from "axios";
import type { LatLng } from "react-native-maps";
import { Portal, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { screenStyles } from "@screen-styles";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY, GOOGLE_PLACES_API } from "@api";
import { ToastService } from "@utility";

interface OwnProps {
  visible: boolean;
  hideModal: () => void;
  TOP_INSET: number;
  setSearchedLocation: React.Dispatch<React.SetStateAction<LatLng>>;
}

const _SearchLocationModal: React.FC<OwnProps> = ({
  hideModal,
  visible,
  setSearchedLocation,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [placeId, setPlaceId] = React.useState("");

  React.useEffect(() => {
    if (!placeId) {
      return;
    }
    axios
      .get(
        `${GOOGLE_PLACES_API}/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      )
      .then((res) => {
        console.log("place details", res.data.result.geometry.location);
        setSearchedLocation({
          latitude: res.data.result.geometry.location.lat,
          longitude: res.data.result.geometry.location.lng,
        });
      })
      .catch((_err) => {
        ToastService.show("place lookup error");
      });
  }, [placeId, setSearchedLocation]);

  return (
    <Portal theme={PaperTheme}>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        style={screenStyles.mainContainer}
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={screenStyles.mainContainer}>
          <View style={{ height: theme.header.height }} />
          <View style={screenStyles.searchContainer}>
            <Searchbar
              theme={PaperTheme}
              autoCapitalize="none"
              value={searchQuery}
              placeholder="Search"
              onChangeText={(query) => setSearchQuery(query)}
              style={[screenStyles.searchStyle, screenStyles.shadow]}
            />
            <TouchableOpacity
              style={[screenStyles.filterButtonStyle, screenStyles.shadow]}
              // onPress={() => {}}
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
              onPress={() => hideModal()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="ios-close-outline"
                size={24}
                color={colors.iconGray}
              />
            </TouchableOpacity>
          </View>
          <GooglePlacesAutocomplete
            styles={{
              textInput: [
                gStyles.descText,
                screenStyles.searchStyle,
                screenStyles.shadow,
                { borderRadius: theme.spacing.md },
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
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export { _SearchLocationModal };
