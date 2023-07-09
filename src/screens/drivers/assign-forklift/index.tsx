import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { ToastService } from "@utility";
import { AssignForkliftFilters } from "@constants";
import { faker } from "@faker-js/faker";
import { _ConfirmModal, _ListEmptyComponent } from "@components";
import { Modal, Portal, RadioButton, Searchbar } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import type { DriverStackScreenProps } from "@navigation-types";

import { _AssignForkliftListCard } from "../components";

const AssignForklift: React.FC<DriverStackScreenProps<"AssignForklift">> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [forklifts, setForklifts] = React.useState<IForklift[]>([]);
  const [searchedForklifts, setSearchedForklifts] = React.useState<IForklift[]>(
    []
  );
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchForkliftsTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [selectedForklifts, setSelectedForklifts] = React.useState<string[]>(
    []
  );

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    AssignForkliftFilters.ALL.toString()
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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
        .rangeToNumber({ min: 13867, max: 50000 })
        .toString(),
      insuranceCompany: faker.company.name(),
      insuranceNo: faker.string.alphanumeric({ length: 12, casing: "upper" }),
      insuranceType: faker.helpers.arrayElement(["life", "property", "travel"]),
      insuranceExpiryDate: faker.date.future().toDateString(),
    };
    setForklifts((prev) => [...prev, record]);
  };

  const handleRefresh = () => {
    setIsFetching(true);
    fetchForkliftsTimeoutRef.current = setTimeout(() => {
      setIsFetching(false);
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

  const handleFilterData = (newValue: string) => {
    console.log("newValue", newValue);
    if (newValue === "1") {
      setSearchedForklifts(forklifts);
      return;
    }
    if (newValue === "2") {
      const toSort = [...forklifts];
      toSort.sort((a, b) => a.name.localeCompare(b.name));
      setSearchedForklifts(toSort);
      return;
    }
    const toSort = [...forklifts];
    toSort.sort((a, b) => a.regNo.localeCompare(b.regNo));
    setSearchedForklifts(toSort);
    return;
  };

  const handleSelectForklift = (forkliftId: string) => {
    let ids = [...selectedForklifts];
    if (ids.includes(forkliftId)) {
      ids = ids.filter((item) => item !== forkliftId);
    } else {
      ids.push(forkliftId);
    }
    setSelectedForklifts(ids);
  };

  const handleAssignForklift = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      ToastService.show("Forklift assigned successfully");
      navigation.goBack();
    }, 1800);
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
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
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
        <TouchableOpacity
          style={screenStyles.filterButtonStyle}
          onPress={() => showModal()}
        >
          <FontAwesome5 name="filter" size={20} color={colors.iconGray} />
        </TouchableOpacity>
        <TouchableOpacity
          style={screenStyles.filterButtonStyle}
          onPress={() => handleAssignForklift()}
        >
          <MaterialIcons name="done-all" size={20} color={colors.iconGray} />
        </TouchableOpacity>
      </View>

      <Portal theme={PaperTheme}>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={screenStyles.filterModalStyle}
        >
          <Text style={gStyles.headerText}>Sort By</Text>
          <>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setSelectedFilter(newValue);
                handleFilterData(newValue);
                hideModal();
              }}
              value={selectedFilter}
            >
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="All"
                  value={AssignForkliftFilters.ALL.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Name"
                  value={AssignForkliftFilters.NAME.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Device Id"
                  value={AssignForkliftFilters.ID.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
            </RadioButton.Group>
          </>
        </Modal>
      </Portal>

      <FlatList
        data={searchedForklifts}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<_ListEmptyComponent label="No Forklifts..." />}
        renderItem={({ item }) => {
          const checked = selectedForklifts.includes(item._id);
          return (
            <_AssignForkliftListCard
              key={item._id}
              item={item}
              checked={checked}
              toggleAssignment={handleSelectForklift}
            />
          );
        }}
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

export { AssignForklift };
