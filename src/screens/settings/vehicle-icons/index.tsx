import { FlatList, RefreshControl, View } from "react-native";
import React from "react";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, theme } from "@theme";
import { _ListEmptyComponent } from "@components";
import { Searchbar } from "react-native-paper";
import { getVehicleList } from "@services";
import { useAuthContext } from "@context";
import { ToastService } from "@utility";

import { _ForkliftListCard } from "../components";

const VehicleIcons: React.FC<
  ProfileSettingsStackScreenProps<"VehicleIcons">
> = ({}) => {
  const {
    state: { token },
  } = useAuthContext();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [forklifts, setForklifts] = React.useState<IVehicle[]>([]);
  const [searchedForklifts, setSearchedForklifts] = React.useState<IVehicle[]>(
    []
  );
  const [isFetching, setIsFetching] = React.useState(false);
  // const fetchForkliftsTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();

  // const addInfo = () => {
  //   const record: IForklift = {
  //     _id: faker.database.mongodbObjectId(),
  //     imei: faker.string.alphanumeric({
  //       casing: "upper",
  //       length: { min: 12, max: 15 },
  //     }),
  //     simNo: faker.string.numeric({ length: 12, allowLeadingZeros: false }),
  //     age: faker.helpers.arrayElement([10, 11, 12, 13, 14, 15, 16]).toString(),
  //     batterySerialNo: faker.vehicle.vin(),
  //     color: faker.vehicle.color(),
  //     forkliftSerialNo: faker.vehicle.vrm(),
  //     make: faker.date.past().getFullYear().toString(),
  //     manufactureYear: faker.date.past().getFullYear().toString(),

  //     purchaseDate: faker.date.past().toDateString(),
  //     rentStartDate: faker.date.past().toDateString(),
  //     rentEndDate: faker.date.future().toDateString(),
  //     milage: faker.helpers
  //       .rangeToNumber({ min: 13867, max: 50000 })
  //       .toString(),
  //     regNo: faker.helpers.rangeToNumber({ min: 1, max: 50000 }).toString(),
  //     image: faker.image.urlPicsumPhotos({ height: 75, width: 75 }),
  //     name: faker.helpers.arrayElement([
  //       "Forklift 1",
  //       "Forklift 2",
  //       "Forklift 3",
  //       "Forklift 4",
  //     ]),
  //     status: faker.helpers.arrayElement([
  //       "moving",
  //       "parked",
  //       "offline",
  //       "faulty",
  //     ]),
  //     driver: faker.person.fullName(),
  //     model: faker.vehicle.vrm(),
  //     fuelType: faker.vehicle.fuel(),
  //     fuelCapacity: faker.helpers
  //       .rangeToNumber({ min: 12, max: 50 })
  //       .toString(),
  //     insuranceType: "Type 1",
  //     insuranceCompany: faker.company.name(),
  //     insuranceExpiryDate: faker.date.future().toDateString(),
  //     insuranceNo: faker.string.alphanumeric({ length: 8, casing: "upper" }),
  //   };
  //   setForklifts((prev) => [...prev, record]);
  // };

  const handleRefresh = () => {
    fetchVehicles(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedForklifts(forklifts);
      return;
    }
    const filteredCustomers = forklifts.filter((vehicle) =>
      vehicle.reg_no.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedForklifts(filteredCustomers);
  };

  const fetchVehicles = React.useCallback(
    (withLoader = true) => {
      setIsFetching(withLoader);
      getVehicleList(token)
        .then((res) => {
          if (res.success) {
            setForklifts(res.data.rows);
          }
        })
        .catch((_err) => {
          ToastService.show("Error occurred");
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    [token]
  );

  React.useEffect(() => {
    if (!forklifts) {
      return;
    }
    setSearchedForklifts(forklifts);
  }, [forklifts]);

  React.useEffect(() => {
    fetchVehicles(false);
  }, [fetchVehicles]);

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
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Forklifts..." />}
        renderItem={({ item }) => (
          <_ForkliftListCard key={item.id.toString()} item={item} />
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
    </SafeAreaView>
  );
};

export { VehicleIcons };
