import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import {
  NoIconHeader,
  _ConfirmModal,
  _DefaultCard,
  _Divider,
  _ListEmptyComponent,
  _ScrollFormLayout,
  _TextInput,
} from "@components";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { PaperTheme, colors, gStyles } from "@theme";
import { Searchbar } from "react-native-paper";
import { ToastService } from "@utility";
import { PoiTypesColor } from "@constants";
import { faker } from "@faker-js/faker";
import { iconColors, iconNames } from "@markers";

import { _PoiListCard } from "../components/_PoiListCard";

//------------------Component------------------------------------------------
const Pois: React.FC<ProfileSettingsStackScreenProps<"Pois">> = ({}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [pois, setPois] = React.useState<IPoi[]>([]);
  const [searchedPois, setSearchedPois] = React.useState<IPoi[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchPoisTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const addInfo = () => {
    const records: IPoi = {
      _id: faker.database.mongodbObjectId(),
      address: faker.location.streetAddress(),
      color: faker.helpers.arrayElement(Object.keys(iconColors)),
      iconName: faker.helpers.arrayElement(Object.keys(iconNames)),
      latitude: 37.78825,
      longitude: -122.4324,
      name: faker.company.name(),
      type: faker.helpers.arrayElement(["private", "business"]),
    };
    setPois((prev) => [...prev, records]);
  };
  const handleRefresh = () => {
    setIsFetching(true);
    fetchPoisTimeoutRef.current = setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedPois(pois);
      return;
    }
    const filteredPois = pois.filter((customer) =>
      customer.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedPois(filteredPois);
  };

  const handleDelete = React.useCallback((poiId: string) => {
    setConfirmDeleteVisible(true);
    console.log("handle delete", poiId);
  }, []);

  const handleDeleteConfirm = () => {
    ToastService.show("Demo delete");
    setConfirmDeleteVisible(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  React.useEffect(() => {
    addInfo();
  }, []);

  React.useEffect(() => {
    setSearchedPois(pois);
  }, [pois]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader title="POI(s)" />
      <_DefaultCard>
        <View style={screenStyles.countRow}>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>10</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: PoiTypesColor.private,
              })}
            >
              Private
            </Text>
          </View>
          <View
            style={StyleSheet.compose(
              screenStyles.countRowItem,
              screenStyles.countRowMiddleItem
            )}
          >
            <Text style={gStyles.headerText}>12</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: PoiTypesColor.business,
              })}
            >
              Business
            </Text>
          </View>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>10</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: PoiTypesColor.total,
              })}
            >
              Total
            </Text>
          </View>
        </View>
        {/* <_Divider />
        <View style={screenStyles.countRow}>
          <View
            style={StyleSheet.compose(screenStyles.countRowMiddleItem, {
              borderRightWidth: 0,
            })}
          />
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>12</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ForkliftStatusColor["offline"],
              })}
            >
              Offline
            </Text>
          </View>
        </View> */}
      </_DefaultCard>

      <View style={screenStyles.searchContainer}>
        <Searchbar
          theme={PaperTheme}
          autoCapitalize="none"
          value={searchQuery}
          placeholder="Search..."
          onChangeText={(query) => handleSearch(query)}
          style={screenStyles.searchStyle}
        />
      </View>

      <FlatList
        data={searchedPois}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<_ListEmptyComponent label="No POI..." />}
        renderItem={({ item }) => (
          <_PoiListCard
            key={item._id}
            item={item}
            handleDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={isFetching}
            colors={[colors.primary]}
            progressBackgroundColor={colors.white}
            onRefresh={handleRefresh}
          />
        }
      />
      <_ConfirmModal
        visible={confirmDeleteVisible}
        question="Are you sure you want to delete this poi ?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
};

export { Pois };
