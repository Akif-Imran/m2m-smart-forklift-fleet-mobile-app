import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { NoIconHeader, _ConfirmModal, _ListEmptyComponent } from "@components";
import { screenStyles } from "src/screens/styles";
import { Modal, Portal, RadioButton, Searchbar } from "react-native-paper";
import { ActivityFilters } from "@constants";
import { faker } from "@faker-js/faker";
import { ToastService } from "@utility";
import { _DriverActivityCard } from "../components";

interface OwnProps {}

const Activity: React.FC<OwnProps> = ({}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [drivers, setDrivers] = React.useState<IDriverActivity[]>([]);
  const [searchedDrivers, setSearchedDrivers] = React.useState<IDriverActivity[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchDriversTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    ActivityFilters.ALL.toString()
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const addInfo = () => {
    const record: IDriverActivity = {
      _id: faker.database.mongodbObjectId(),
      image: faker.image.urlPicsumPhotos(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventType: faker.lorem.sentence(2),
      date: faker.date.past().toJSON(),
      description: faker.lorem.sentence(3),
    };
    setDrivers((prev) => [...prev, record]);
  };

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
    }
    let matchingKey: string | ActivityFilters = "1";
    Object.entries(ActivityFilters).forEach((value) => {
      if (newValue === value[0]) {
        matchingKey = value[1];
      }
    });
    console.log("matchingKey", matchingKey);
    if (!matchingKey) return;
    console.log("matchingKey", matchingKey);
    const filtered = drivers.filter(
      (value) => value.name.split(" ")[1].toLowerCase() === matchingKey.toString().toLowerCase()
    );
    setSearchedDrivers((prev) => filtered);
  };

  const handleDelete = React.useCallback((customerId: string) => {
    setConfirmDeleteVisible(true);
    console.log("handle delete");
  }, []);

  const handleDeleteConfirm = () => {
    ToastService.show("Demo delete");
    setConfirmDeleteVisible(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  React.useEffect(() => {
    if (!drivers) return;
    setSearchedDrivers(drivers);

    return () => {
      clearTimeout(fetchDriversTimeoutRef.current);
    };
  }, [drivers]);

  React.useEffect(() => {
    addInfo();
    addInfo();
  }, []);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <_ConfirmModal
        visible={confirmDeleteVisible}
        question="Are you sure you want to delete this driver activity?"
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
        <TouchableOpacity style={screenStyles.filterButtonStyle} onPress={() => showModal()}>
          <FontAwesome5 name="filter" size={20} color={colors.iconGray} />
        </TouchableOpacity>
      </View>

      <Portal theme={PaperTheme}>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={screenStyles.filterModalStyle}
        >
          <Text style={gStyles.headerText}>Activity Filter</Text>
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
                  value={ActivityFilters.ALL.toString()}
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
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<_ListEmptyComponent label="No Drivers..." />}
        renderItem={({ item }) => (
          <_DriverActivityCard key={item._id} item={item} handleDelete={handleDelete} />
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

export { Activity };
