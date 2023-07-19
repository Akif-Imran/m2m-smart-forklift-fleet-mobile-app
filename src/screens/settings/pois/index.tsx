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
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { Searchbar } from "react-native-paper";
import { ToastService } from "@utility";
import { PoiTypesColor } from "@constants";
import { deletePoi, getPoiCounts, getPoiList } from "@services";
import { useAuthContext } from "@context";

import { _PoiListCard } from "../components/_PoiListCard";
interface ICount {
  private: number;
  business: number;
  total: number;
}
//------------------Component------------------------------------------------
const Pois: React.FC<ProfileSettingsStackScreenProps<"Pois">> = ({}) => {
  const {
    state: { token },
  } = useAuthContext();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [pois, setPois] = React.useState<IPOI[]>([]);
  const [searchedPois, setSearchedPois] = React.useState<IPOI[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchPoisTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const [toBeDeletedPoiId, setToBeDeletedPoiId] = React.useState<number>(0);
  const [poiCounts, setPoiCounts] = React.useState<ICount>({
    business: 0,
    private: 0,
    total: 0,
  });
  // const addInfo = () => {
  //   const records: IPoi = {
  //     _id: faker.database.mongodbObjectId(),
  //     address: faker.location.streetAddress(),
  //     color: faker.helpers.arrayElement(Object.keys(iconColors)),
  //     iconName: faker.helpers.arrayElement(Object.keys(iconNames)),
  //     latitude: 37.78825,
  //     longitude: -122.4324,
  //     name: faker.company.name(),
  //     type: faker.helpers.arrayElement(["private", "business"]),
  //   };
  //   setPois((prev) => [...prev, records]);
  // };
  const handleRefresh = () => {
    fetchPois();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedPois(pois);
      return;
    }
    const filtered = pois.filter((poi) =>
      poi.poi_name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedPois(filtered);
  };

  const handleDelete = React.useCallback((poiId: number) => {
    setToBeDeletedPoiId(poiId);
    setConfirmDeleteVisible(true);
    console.log("handle delete", poiId);
  }, []);

  const handleDeleteConfirm = () => {
    setConfirmDeleteVisible(false);
    deletePoi(token, toBeDeletedPoiId.toString())
      .then((res) => {
        ToastService.show(res?.message || "");
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      })
      .finally(() => {
        setConfirmDeleteVisible(false);
        fetchPois();
      });
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  // React.useEffect(() => {
  //   addInfo();
  // }, []);

  React.useEffect(() => {
    setSearchedPois(pois);
  }, [pois]);

  const fetchPoiCounts = React.useCallback(() => {
    getPoiCounts(token)
      .then((res) => {
        if (res.success) {
          const counts: ICount = {
            business: 0,
            private: 0,
            total: 0,
          };
          res.data.forEach((item) => {
            if (item.poi_type === 1) {
              counts.private = item.total;
            } else if (item.poi_type === 2) {
              counts.business = item.total;
            }
            counts.total = counts.private + counts.business;
          });
          setPoiCounts(counts);
        }
      })
      .catch((_err) => {
        ToastService.show("Count Error");
        console.log(_err?.message);
      });
  }, [token]);

  const fetchPois = React.useCallback(() => {
    setIsFetching(true);
    getPoiList(token)
      .then((res) => {
        if (res.success) {
          setPois((_prev) => res.data.rows);
        }
      })
      .catch((_err) => {
        ToastService.show("POI Error occurred");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token]);

  React.useEffect(() => {
    fetchPois();
    fetchPoiCounts();
  }, [fetchPois, fetchPoiCounts]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      {/* <NoIconHeader title="POI(s)" /> */}
      <View style={{ height: theme.header.height }} />
      <_DefaultCard>
        <View style={screenStyles.countRow}>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>{poiCounts.private}</Text>
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
            <Text style={gStyles.headerText}>{poiCounts.business}</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: PoiTypesColor.business,
              })}
            >
              Business
            </Text>
          </View>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>{poiCounts.total}</Text>
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
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No POI..." />}
        renderItem={({ item }) => (
          <_PoiListCard
            key={item.id.toString()}
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
