import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { _ConfirmModal, _ListEmptyComponent } from "@components";
import { screenStyles } from "@screen-styles";
import { Modal, Portal, RadioButton, Searchbar } from "react-native-paper";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import { FontAwesome5 } from "@expo/vector-icons";
import { ForkliftNotificationsFilters } from "@constants";
import { getNotificationsList } from "@services";
import { useAuthContext } from "@context";

import { _NotificationListCard } from "../components";

const ForkliftNotification: React.FC<
  ForkliftStackScreenProps<"Notification">
> = ({}) => {
  const {
    state: { token },
  } = useAuthContext();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const [searchedNotifications, setSearchedNotifications] = React.useState<
    INotification[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    ForkliftNotificationsFilters.ALL.toString()
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  /*   const addInfo = () => {
    const on: INotification = {
      _id: faker.database.mongodbObjectId(),
      model: faker.vehicle.vrm(),
      regNo: faker.helpers.rangeToNumber({ min: 1, max: 50000 }).toString(),
      date: faker.date.past().toJSON(),
      event: "Ignition ON",
      description: "Ignition on just now",
      driver: faker.person.fullName(),
    };
    const off: INotification = {
      _id: faker.database.mongodbObjectId(),
      model: faker.vehicle.vrm(),
      regNo: faker.helpers.rangeToNumber({ min: 1, max: 50000 }).toString(),
      date: faker.date.past().toJSON(),
      event: "Ignition OFF",
      description: "Ignition off just now",
      driver: faker.person.fullName(),
    };
    setNotifications((prev) => [...prev, on, off]);
  }; */

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedNotifications(notifications);
      return;
    }
    const filtered = notifications.filter(
      (notification) =>
        notification.title.toLowerCase().includes(query.toLowerCase()) ||
        notification.body.toLowerCase().includes(query.toLowerCase()) ||
        notification.IMEI.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedNotifications(filtered);
  };

  const handleFilterData = (newValue: string) => {
    console.log("newValue", newValue);
    if (newValue === "1") {
      setSearchedNotifications(notifications);
      return;
    } else if (newValue === "2") {
      const filtered = notifications.filter((value) => {
        return value.driver === true;
      });
      setSearchedNotifications((_prev) => filtered);
      return;
    } else if (newValue === "3") {
      const filtered = notifications.filter((value) => {
        return value.service === true;
      });
      setSearchedNotifications((_prev) => filtered);
      return;
    }
  };

  const handleDelete = React.useCallback((notificationId: string) => {
    setConfirmDeleteVisible(true);
    console.log("handle delete", notificationId);
  }, []);

  const handleDeleteConfirm = () => {
    ToastService.show("Demo delete");
    setConfirmDeleteVisible(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  const fetchNotifications = React.useCallback(() => {
    setIsFetching(true);
    getNotificationsList(token)
      .then((res) => {
        if (res.success) {
          setNotifications(res.result);
        }
      })
      .catch((_err) => {
        ToastService.show(_err.message || "");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token]);

  React.useEffect(() => {
    if (!notifications) {
      return;
    }
    setSearchedNotifications(notifications);
  }, [notifications]);

  React.useEffect(() => {
    // addInfo();
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ marginTop: theme.header.height }} />
      <_ConfirmModal
        visible={confirmDeleteVisible}
        question="Are you sure you want to delete this notifications ?"
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
          <Text style={gStyles.headerText}>Project Status</Text>
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
                  value={ForkliftNotificationsFilters.ALL.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Driver"
                  value={ForkliftNotificationsFilters.DRIVER.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Service"
                  value={ForkliftNotificationsFilters.SERVICE.toString()}
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
        data={searchedNotifications}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<_ListEmptyComponent label="No Notifications..." />}
        renderItem={({ item }) => (
          <_NotificationListCard
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
    </SafeAreaView>
  );
};

export { ForkliftNotification };
