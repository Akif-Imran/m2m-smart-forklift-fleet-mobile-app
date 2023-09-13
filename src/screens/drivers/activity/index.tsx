import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { _ConfirmModal, _ListEmptyComponent } from "@components";
import { screenStyles } from "@screen-styles";
import { FAB, Modal, Portal, RadioButton, Searchbar } from "react-native-paper";
import { ActivityFilters } from "@constants";
import { ToastService } from "@utility";
import type { DriverStackScreenProps } from "@navigation-types";
import { useAuthContext } from "@context";
import { getDriverBehaviorByDriverId } from "@services";
import { useIsFocused } from "@react-navigation/native";

import { _DriverActivityCard } from "../components";

const Activity: React.FC<DriverStackScreenProps<"Activity">> = ({
  navigation,
  route,
}) => {
  const { _id } = route.params;
  const {
    state: { isWarehouse, isAdmin, token },
  } = useAuthContext();
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [driverActivities, setDriverActivities] = React.useState<
    IDriverActivity[]
  >([]);
  const [searchedDriverActivity, setSearchedDriverActivity] = React.useState<
    IDriverActivity[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    ActivityFilters.ALL.toString()
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // const addInfo = () => {
  //   const record: IDriverActivity = {
  //     _id: faker.database.mongodbObjectId(),
  //     image: faker.image.urlPicsumPhotos(),
  //     name: faker.person.fullName(),
  //     email: faker.internet.email(),
  //     eventType: faker.lorem.sentence(2),
  //     date: faker.date.past().toJSON(),
  //     description: faker.lorem.sentence(3),
  //   };
  //   setDriverActivities((prev) => [...prev, record]);
  // };

  const handleRefresh = () => {
    fetchDriverBehavior();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedDriverActivity(driverActivities);
      return;
    }
    const filtered = driverActivities.filter(
      (activity) =>
        activity.description.toLowerCase().includes(query.toLowerCase()) ||
        activity.event_type.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedDriverActivity(filtered);
  };

  const handleFilterData = (newValue: string) => {
    console.log("newValue", newValue);
    if (newValue === "1") {
      setSearchedDriverActivity(driverActivities);
      return;
    }
    let matchingKey: string | ActivityFilters = "1";
    Object.entries(ActivityFilters).forEach(([key, value]) => {
      if (newValue === key) {
        matchingKey = value;
      }
    });
    console.log("matchingKey", matchingKey);
    if (!matchingKey) {
      return;
    }
    console.log("matchingKey", matchingKey);
    const filtered = driverActivities.filter(
      (value) =>
        value.description.split(" ")[1].toLowerCase() ===
        matchingKey.toString().toLowerCase()
    );
    setSearchedDriverActivity((_prev) => filtered);
  };

  const handleDelete = React.useCallback((activityId: string) => {
    setConfirmDeleteVisible(true);
    console.log("handle delete", activityId);
  }, []);

  const handleDeleteConfirm = () => {
    ToastService.show("Demo delete");
    setConfirmDeleteVisible(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  const fetchDriverBehavior = React.useCallback(
    (withLoader = true) => {
      setIsFetching(withLoader);
      getDriverBehaviorByDriverId(token, _id)
        .then((res) => {
          if (res.success) {
            setDriverActivities(res.data.rows);
          }
        })
        .catch((_err) => {
          console.log(_err?.message);
          ToastService.show("Driver Behavior list error");
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    [token, _id]
  );

  React.useEffect(() => {
    if (!driverActivities) {
      return;
    }
    setSearchedDriverActivity(driverActivities);
  }, [driverActivities]);

  React.useEffect(() => {
    fetchDriverBehavior(false);
  }, [fetchDriverBehavior, isFocused]);

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
        data={searchedDriverActivity}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(activity) => activity.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Activity..." />}
        renderItem={({ item: activity }) => (
          <_DriverActivityCard
            key={activity.id}
            item={activity}
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
      {(isWarehouse || isAdmin) && (
        <FAB
          icon="plus"
          style={gStyles.fab}
          color={colors.white}
          // onLongPress={() => addInfo()}
          onPress={() =>
            navigation.navigate("AddActivity", {
              mode: "add",
            })
          }
        />
      )}
    </SafeAreaView>
  );
};

export { Activity };
