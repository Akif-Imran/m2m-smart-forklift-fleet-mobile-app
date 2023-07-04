import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React from "react";

import { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import {
  NoIconHeader,
  _ConfirmModal,
  _DefaultCard,
  _Divider,
  _ListEmptyComponent,
} from "@components";
import { PaperTheme, colors, gStyles } from "@theme";
import { FAB, Searchbar } from "react-native-paper";
import { ToastService } from "@utility";
import { _ForkliftListCard } from "../components";
import { faker } from "@faker-js/faker";
import { ForkliftStatusColor } from "@constants";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const Forklift: React.FC<ForkliftStackScreenProps<"Forklift">> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [forklifts, setForklifts] = React.useState<IForklift[]>([]);
  const [searchedForklifts, setSearchedForklifts] = React.useState<IForklift[]>([]);
  const [isFetchingForklifts, setIsFetchingForklifts] = React.useState(false);
  const fetchForkliftsTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);

  const addInfo = () => {
    const record: IForklift = {
      _id: faker.database.mongodbObjectId(),
      imei: faker.string.alphanumeric({ casing: "upper", length: { min: 12, max: 15 } }),
      simNo: faker.string.numeric({ length: 12, allowLeadingZeros: false }),
      age: faker.helpers.arrayElement([10, 11, 12, 13, 14, 15, 16]).toString(),
      batterySerialNo: faker.vehicle.vin(),
      color: faker.vehicle.color(),
      forkliftSerialNo: faker.vehicle.vrm(),
      make: faker.date.past().getFullYear().toString(),
      manufactureYear: faker.date.past().getFullYear().toString(),

      purchaseDate: faker.date.past().toDateString(),
      rentStartDate: faker.date.past().toDateString(),
      rentEndDate: faker.date.future().toDateString(),
      milage: faker.helpers.rangeToNumber({ min: 13867, max: 50000 }).toString(),
      regNo: faker.helpers.rangeToNumber({ min: 1, max: 50000 }).toString(),
      image: faker.image.urlPicsumPhotos({ height: 75, width: 75 }),
      name: faker.helpers.arrayElement(["Forklift 1", "Forklift 2", "Forklift 3", "Forklift 4"]),
      status: faker.helpers.arrayElement(["moving", "parked", "offline", "faulty"]),
      driver: faker.person.fullName(),
      model: faker.vehicle.vrm(),
      fuelType: faker.vehicle.fuel(),
      fuelCapacity: faker.helpers.rangeToNumber({ min: 12, max: 50 }).toString(),
      insuranceType: "Type 1",
      insuranceCompany: faker.company.name(),
      insuranceExpiryDate: faker.date.future().toDateString(),
      insuranceNo: faker.string.alphanumeric({ length: 8, casing: "upper" }),
    };
    setForklifts((prev) => [...prev, record]);
  };

  const handleRefresh = () => {
    setIsFetchingForklifts(true);
    fetchForkliftsTimeoutRef.current = setTimeout(() => {
      setIsFetchingForklifts(false);
    }, 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedForklifts(forklifts);
      return;
    }
    const filteredCustomers = forklifts.filter((customer) =>
      customer.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedForklifts(filteredCustomers);
  };

  const handleDelete = React.useCallback((customerId: string) => {
    setConfirmDeleteVisible(true);
    console.log("handle delete", customerId);
  }, []);

  const handleDeleteConfirm = () => {
    ToastService.show("Demo delete");
    setConfirmDeleteVisible(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  React.useEffect(() => {
    if (!forklifts) return;
    setSearchedForklifts(forklifts);

    return () => {
      clearTimeout(fetchForkliftsTimeoutRef.current);
    };
  }, [forklifts]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader
        title="Forklifts"
        left={[
          {
            icon: <FontAwesome5 name="map-marked-alt" size={24} color={colors.primary} />,
            onPress: () =>
              navigation.navigate("BirdEyeView", {
                mode: "multiple",
                points: [
                  {
                    latitude: 3.139003,
                    longitude: 101.686855,
                    name: "PT-01",
                  },
                  {
                    latitude: 3.154159,
                    longitude: 101.713877,
                    name: "PT-02",
                  },
                  {
                    latitude: 3.151663,
                    longitude: 101.695417,
                    name: "PT-03",
                  },
                  {
                    latitude: 3.149408,
                    longitude: 101.696225,
                    name: "PT-04",
                  },
                ],
              }),
          },
        ]}
        right={[
          {
            icon: <Ionicons name="notifications" size={24} color={colors.primary} />,
            onPress: () => navigation.navigate("Notification"),
          },
        ]}
      />
      <_ConfirmModal
        visible={confirmDeleteVisible}
        question="Are you sure you want to delete this customer ?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <FlatList
        data={searchedForklifts}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={() => (
          <>
            {/* counts */}
            <_DefaultCard>
              <View style={screenStyles.countRow}>
                <View style={screenStyles.countRowItem}>
                  <Text style={gStyles.headerText}>10</Text>
                  <Text
                    style={StyleSheet.compose(screenStyles.countInfoText, {
                      color: ForkliftStatusColor["moving"],
                    })}
                  >
                    Moving
                  </Text>
                </View>
                <View
                  style={StyleSheet.compose(screenStyles.countRowMiddleItem, {
                    borderRightWidth: 0,
                  })}
                />
                <View style={screenStyles.countRowItem}>
                  <Text style={gStyles.headerText}>12</Text>
                  <Text
                    style={StyleSheet.compose(screenStyles.countInfoText, {
                      color: ForkliftStatusColor["parked"],
                    })}
                  >
                    Parked
                  </Text>
                </View>
              </View>
              <_Divider />
              <View style={screenStyles.countRow}>
                <View style={screenStyles.countRowItem}>
                  <Text style={gStyles.headerText}>10</Text>
                  <Text
                    style={StyleSheet.compose(screenStyles.countInfoText, {
                      color: ForkliftStatusColor["total"],
                    })}
                  >
                    Total
                  </Text>
                </View>
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
              </View>
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
          </>
        )}
        ListEmptyComponent={<_ListEmptyComponent label="No Forklifts..." />}
        renderItem={({ item }) => (
          <_ForkliftListCard key={item._id} item={item} handleDelete={handleDelete} />
        )}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={isFetchingForklifts}
            colors={[colors.primary]}
            progressBackgroundColor={colors.white}
            onRefresh={handleRefresh}
          />
        }
      />

      <FAB
        icon="plus"
        style={gStyles.fab}
        color={colors.white}
        onLongPress={() => addInfo()}
        onPress={() =>
          navigation.navigate("AddForklift", {
            mode: "add",
          })
        }
      />
    </SafeAreaView>
  );
};

export { Forklift };
