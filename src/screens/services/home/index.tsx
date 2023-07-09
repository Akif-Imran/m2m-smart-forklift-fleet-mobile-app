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
} from "@components";
import { PaperTheme, colors, gStyles } from "@theme";
import { ServiceStatusColor } from "@constants";
import { Searchbar } from "react-native-paper";
import { faker } from "@faker-js/faker";
import { ToastService } from "@utility";
import { Ionicons } from "@expo/vector-icons";
import type { ServiceStackScreenProps } from "@navigation-types";

import { _ServiceListCard } from "../components";

const Services: React.FC<ServiceStackScreenProps<"Services">> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [services, setServices] = React.useState<IService[]>([]);
  const [searchedServices, setSearchedServices] = React.useState<IService[]>(
    []
  );
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchServicesTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);

  const addInfo = () => {
    const record1: IService = {
      _id: faker.database.mongodbObjectId(),
      date: faker.date.past().toJSON(),
      regNo: faker.vehicle.vrm(),
      status: faker.helpers.arrayElement(["completed", "inprocess", "pending"]),
      type: faker.helpers.arrayElement([
        "body",
        "breakdown",
        "warranty",
        "scheduled",
      ]),
      description: faker.lorem.sentence({ min: 5, max: 8 }),
    };
    const record2: IService = {
      _id: faker.database.mongodbObjectId(),
      date: faker.date.past().toJSON(),
      regNo: faker.vehicle.vrm(),
      status: faker.helpers.arrayElement(["completed", "inprocess", "pending"]),
      type: faker.helpers.arrayElement([
        "body",
        "breakdown",
        "warranty",
        "scheduled",
      ]),
      description: faker.lorem.sentence({ min: 5, max: 8 }),
    };
    setServices((prev) => [...prev, record1, record2]);
  };

  const handleRefresh = () => {
    setIsFetching(true);
    fetchServicesTimeoutRef.current = setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedServices(services);
      return;
    }
    const filtered = services.filter(
      (service) =>
        service.regNo.toLowerCase().includes(query.toLowerCase()) ||
        service.status.toLowerCase().includes(query.toLowerCase()) ||
        service.type.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedServices(filtered);
  };

  const handleDelete = React.useCallback(() => {
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
    if (!services) {
      return;
    }
    setSearchedServices(services);

    return () => {
      clearTimeout(fetchServicesTimeoutRef.current);
    };
  }, [services]);

  React.useEffect(() => {
    addInfo();
  }, []);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader
        title="Services"
        right={[
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
        question="Are you sure you want to delete this service ?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      {/* counts */}
      <_DefaultCard>
        <View style={screenStyles.countRow}>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>10</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ServiceStatusColor.completed,
              })}
            >
              Complete
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
                color: ServiceStatusColor.pending,
              })}
            >
              Pending
            </Text>
          </View>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>12</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ServiceStatusColor.inprocess,
              })}
            >
              In process
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

      <FlatList
        data={searchedServices}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<_ListEmptyComponent label="No Services..." />}
        renderItem={({ item }) => (
          <_ServiceListCard
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

export { Services };
