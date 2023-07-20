import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NoIconHeader, _ConfirmModal, _ListEmptyComponent } from "@components";
import { screenStyles } from "@screen-styles";
import { FAB, Modal, Portal, RadioButton, Searchbar } from "react-native-paper";
import { PaperTheme, colors, gStyles } from "@theme";
import type { DriverStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { DriversFilters } from "@constants";
import { deleteDriver, getDrivers } from "@services";
import { useAuthContext } from "@context";
import { useIsFocused } from "@react-navigation/native";

import { _DriverListCard } from "../components";

const Drivers: React.FC<DriverStackScreenProps<"Drivers">> = ({
  navigation,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const isFocused = useIsFocused();
  const [toDeleteDriverId, setToDeleteDriverId] = React.useState<number>(0);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [drivers, setDrivers] = React.useState<IDriver[]>([]);
  const [searchedDrivers, setSearchedDrivers] = React.useState<IDriver[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchDriversTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    DriversFilters.ALL.toString()
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // const addInfo = () => {
  //   const record: IDriver = {
  //     _id: faker.database.mongodbObjectId(),
  //     image: faker.image.urlPicsumPhotos(),
  //     name: faker.person.fullName(),
  //     rating: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
  //     touchId: faker.string.alphanumeric({ length: 10, casing: "upper" }),
  //     email: faker.internet.email(),
  //     department: faker.helpers.arrayElement([
  //       "CEO",
  //       "HR",
  //       "IT",
  //       "Marketing",
  //       "Sales",
  //     ]),
  //     ic_number: faker.string.alphanumeric({ length: 13, casing: "upper" }),
  //     experience: faker.helpers.rangeToNumber({ min: 3, max: 8 }).toString(),
  //     joiningDate: moment(faker.date.past()).format("YYYY-MM-DD"),
  //     licenseType: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]),
  //     mobileNo: faker.phone.number(),
  //     password: faker.string.alphanumeric({ length: 10, casing: "upper" }),
  //   };
  //   setDrivers((prev) => [...prev, record]);
  // };

  const handleRefresh = () => {
    setIsFetching(true);
    fetchDriversTimeoutRef.current = setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedDrivers(drivers);
      return;
    }
    const filteredCustomers = drivers.filter((customer) =>
      customer.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedDrivers(filteredCustomers);
  };

  const handleFilterData = (newValue: string) => {
    console.log("newValue", newValue);
    if (newValue === "1") {
      setSearchedDrivers(drivers);
      return;
    } else if (newValue === "2") {
      //assigned
      const filtered = drivers.filter((value) => value.assign === true);
      setSearchedDrivers((_prev) => filtered);
      return;
    } else if (newValue === "3") {
      //unassigned
      const filtered = drivers.filter((value) => value.assign === false);
      setSearchedDrivers((_prev) => filtered);
      return;
    }
    // let matchingKey: string | DriversFilters = "1";
    // Object.entries(DriversFilters).forEach((value) => {
    //   if (newValue === value[0]) {
    //     matchingKey = value[1];
    //   }
    // });
    // console.log("matchingKey", matchingKey);
    // if (!matchingKey) return;
    // console.log("matchingKey", matchingKey);
    // const filtered = drivers.filter(
    //   (value) => value.name.split(" ")[1].toLowerCase() === matchingKey.toString().toLowerCase()
    // );
    // setSearchedDrivers((_prev) => filtered);
  };

  const handleDelete = React.useCallback((driverId: number) => {
    setToDeleteDriverId(driverId);
    console.log("handle delete", driverId);
    setConfirmDeleteVisible(true);
  }, []);

  const handleDeleteConfirm = () => {
    removeDriver();
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  const fetchDrivers = React.useCallback(() => {
    setIsFetching(true);
    getDrivers(token)
      .then((res) => {
        if (res.success) {
          setDrivers(res.data.rows);
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token]);

  const removeDriver = () => {
    deleteDriver(token, toDeleteDriverId.toString())
      .then((res) => {
        ToastService.show(res.message);
      })
      .catch((_err) => {
        console.log(_err.message);
        ToastService.show("Error occurred");
      })
      .finally(() => {
        setConfirmDeleteVisible(false);
        fetchDrivers();
      });
  };

  React.useEffect(() => {
    if (!drivers) {
      return;
    }
    setSearchedDrivers(drivers);
    return () => {
      clearTimeout(fetchDriversTimeoutRef.current);
    };
  }, [drivers]);

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchDrivers();
  }, [fetchDrivers, isFocused]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader
        title="Drivers"
        left={[]}
        right={[
          // {
          //   icon: (
          //     <MaterialCommunityIcons
          //       name="barcode-scan"
          //       size={24}
          //       color={colors.primary}
          //     />
          //   ),
          //   onPress: () => navigation.navigate("BarcodeScanner"),
          // },
          {
            icon: (
              <Ionicons name="notifications" size={24} color={colors.primary} />
            ),
            onPress: () => navigation.navigate("Notification"),
          },
        ]}
      />
      <_ConfirmModal
        visible={confirmDeleteVisible}
        question="Are you sure you want to delete this driver ?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
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
      </View>

      <Portal theme={PaperTheme}>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={screenStyles.filterModalStyle}
        >
          <Text style={gStyles.headerText}>Drivers Filter</Text>
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
                  value={DriversFilters.ALL.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Assigned"
                  value={DriversFilters.ASSIGNED.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Unassigned"
                  value={DriversFilters.UNASSIGNED.toString()}
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
        data={searchedDrivers}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Drivers..." />}
        renderItem={({ item }) => (
          <_DriverListCard
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

      <FAB
        icon="plus"
        style={gStyles.fab}
        color={colors.white}
        // onLongPress={() => addInfo()}
        onPress={() =>
          navigation.navigate("AddDriver", {
            mode: "add",
          })
        }
      />
    </SafeAreaView>
  );
};

export { Drivers };
