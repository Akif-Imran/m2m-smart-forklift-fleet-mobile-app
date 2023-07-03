import { FlatList, RefreshControl, View } from "react-native";
import React from "react";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { PaperTheme, colors, theme } from "@theme";
import { _ListEmptyComponent } from "@components";
import { Searchbar } from "react-native-paper";
import { faker } from "@faker-js/faker";

import { _ForkliftListCard } from "../components";

const VehicleIcons: React.FC<
  ProfileSettingsStackScreenProps<"VehicleIcons">
> = ({}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [forklifts, setForklifts] = React.useState<IForklift[]>([]);
  const [searchedForklifts, setSearchedForklifts] = React.useState<IForklift[]>(
    []
  );
  const [isFetchingForklifts, setIsFetchingForklifts] = React.useState(false);
  const fetchForkliftsTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();

  const addInfo = () => {
    const record: IForklift = {
      _id: faker.database.mongodbObjectId(),
      imei: faker.string.alphanumeric({
        casing: "upper",
        length: { min: 12, max: 15 },
      }),
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
      milage: faker.helpers
        .rangeToNumber({ min: 13867, max: 50000 })
        .toString(),
      regNo: faker.helpers.rangeToNumber({ min: 1, max: 50000 }).toString(),
      image: faker.image.urlPicsumPhotos({ height: 75, width: 75 }),
      name: faker.helpers.arrayElement([
        "Forklift 1",
        "Forklift 2",
        "Forklift 3",
        "Forklift 4",
      ]),
      status: faker.helpers.arrayElement([
        "moving",
        "parked",
        "offline",
        "faulty",
      ]),
      driver: faker.person.fullName(),
      model: faker.vehicle.vrm(),
      fuelType: faker.vehicle.fuel(),
      fuelCapacity: faker.helpers
        .rangeToNumber({ min: 12, max: 50 })
        .toString(),
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

  React.useEffect(() => {
    if (!forklifts) {
      return;
    }
    setSearchedForklifts(forklifts);

    return () => {
      clearTimeout(fetchForkliftsTimeoutRef.current);
    };
  }, [forklifts]);

  React.useEffect(() => {
    addInfo();
    addInfo();
  }, []);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
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
        data={searchedForklifts}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<_ListEmptyComponent label="No Forklifts..." />}
        renderItem={({ item }) => (
          <_ForkliftListCard key={item._id} item={item} />
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
    </SafeAreaView>
  );
};

export { VehicleIcons };
