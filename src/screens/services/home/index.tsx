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
import { ToastService } from "@utility";
import { Ionicons } from "@expo/vector-icons";
import type { ServiceStackScreenProps } from "@navigation-types";
import { deleteService, getServiceCounts, getServices } from "@services";
import { useAuthContext } from "@context";
import { useIsFocused } from "@react-navigation/native";

import { _ServiceListCard } from "../components";
interface IServiceCounts {
  inprocess: number;
  completed: number;
  pending: number;
}

const Services: React.FC<ServiceStackScreenProps<"Services">> = ({
  navigation,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [services, setServices] = React.useState<IService[]>([]);
  const [searchedServices, setSearchedServices] = React.useState<IService[]>(
    []
  );
  const [toDeleteServiceId, setToDeleteServiceId] = React.useState<number>(0);
  const [isFetching, setIsFetching] = React.useState(false);
  // const fetchServicesTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const [serviceCounts, setServiceCounts] = React.useState<IServiceCounts>({
    inprocess: 0,
    completed: 0,
    pending: 0,
  });

  /*   const addInfo = () => {
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
  }; */

  const handleRefresh = () => {
    fetchServices();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedServices(services);
      return;
    }
    const filtered = services.filter(
      (service) =>
        service.type_name.toLowerCase().includes(query.toLowerCase()) ||
        service.status.toLowerCase().includes(query.toLowerCase()) ||
        service.id.toString().toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedServices(filtered);
  };

  const handleDelete = React.useCallback((serviceId: number) => {
    setToDeleteServiceId(serviceId);
    setConfirmDeleteVisible(true);
    console.log("handle delete");
  }, []);

  const handleDeleteConfirm = () => {
    removeService();
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  React.useEffect(() => {
    if (!services) {
      return;
    }
    setSearchedServices(services);
  }, [services]);

  const fetchServiceCounts = React.useCallback(() => {
    getServiceCounts(token)
      .then((res) => {
        if (res.success) {
          const counts = res.data;
          setServiceCounts({
            completed: counts.Completed,
            inprocess: counts["In Process"],
            pending: counts.Pending,
          });
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred!");
      });
  }, [token]);

  const fetchServices = React.useCallback(() => {
    setIsFetching(true);
    getServices(token)
      .then((res) => {
        if (res.success) {
          setServices(res.data.rows);
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred!");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token]);

  const removeService = React.useCallback(() => {
    deleteService(token, toDeleteServiceId)
      .then((res) => {
        console.log(res);
        ToastService.show("Service Delete successfully");
      })
      .catch((_err) => {
        ToastService.show("Error occurred!");
      })
      .finally(() => {
        setConfirmDeleteVisible(false);
        fetchServices();
      });
  }, [token, fetchServices, toDeleteServiceId]);

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchServiceCounts();
    fetchServices();
    // addInfo();
  }, [fetchServiceCounts, fetchServices, isFocused]);

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
            <Text style={gStyles.headerText}>{serviceCounts.completed}</Text>
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
            <Text style={gStyles.headerText}>{serviceCounts.pending}</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ServiceStatusColor.pending,
              })}
            >
              Pending
            </Text>
          </View>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>{serviceCounts.inprocess}</Text>
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
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Services..." />}
        renderItem={({ item }) => (
          <_ServiceListCard
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
    </SafeAreaView>
  );
};

export { Services };
