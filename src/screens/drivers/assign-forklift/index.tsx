/* eslint-disable camelcase */
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
import { _ConfirmModal, _ListEmptyComponent } from "@components";
import { Modal, Portal, RadioButton, Searchbar } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import type { DriverStackScreenProps } from "@navigation-types";
import { assignVehicles, getAssignedVehicles, getVehicleList } from "@services";
import { useAuthContext } from "@context";

import { _AssignForkliftListCard } from "../components";

const AssignForklift: React.FC<DriverStackScreenProps<"AssignForklift">> = ({
  navigation,
  route,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const { item } = route.params;
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [vehicles, setVehicles] = React.useState<IVehicle[]>([]);
  const [searchedVehicles, setSearchedVehicles] = React.useState<IVehicle[]>(
    []
  );
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchForkliftsTimeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const [selectedForklifts, setSelectedForklifts] = React.useState<number[]>(
    []
  );

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    AssignForkliftFilters.ALL.toString()
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleRefresh = () => {
    setIsFetching(true);
    fetchForkliftsTimeoutRef.current = setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedVehicles(vehicles);
      return;
    }
    const filtered = vehicles.filter((vehicle) =>
      vehicle.reg_no.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedVehicles(filtered);
  };

  const handleFilterData = (newValue: string) => {
    console.log("newValue", newValue);
    if (newValue === "1") {
      setSearchedVehicles(vehicles);
      return;
    } else if (newValue === "2") {
      const toSort = [...vehicles];
      toSort.sort((a, b) => a.reg_no.localeCompare(b.reg_no));
      setSearchedVehicles(toSort);
      return;
    } else {
      const toSort = [...vehicles];
      toSort.sort((a, b) => a.id - b.id);
      setSearchedVehicles(toSort);
      return;
    }
  };

  const handleSelectForklift = (forkliftId: number) => {
    let ids = [...selectedForklifts];
    if (ids.includes(forkliftId)) {
      ids = ids.filter((id) => id !== forkliftId);
    } else {
      ids.push(forkliftId);
    }
    setSelectedForklifts(ids);
  };

  const handleAssignForklift = () => {
    setIsLoading(true);
    assignVehicles(token, {
      driver_id: item.id,
      vehicle_ids: selectedForklifts,
    })
      .then((res) => {
        ToastService.show(res?.message || "");
        if (res.success) {
          // ToastService.show("Forklifts assigned successfully");
          navigation.goBack();
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    if (!vehicles) {
      return;
    }
    setSearchedVehicles(vehicles);
  }, [vehicles]);

  const fetchVehicles = React.useCallback(() => {
    setIsFetching(true);
    getVehicleList(token)
      .then((res) => {
        if (res.success) {
          setVehicles(res.data.rows);
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token]);

  const fetchAssignedVehicles = React.useCallback(() => {
    setIsFetching(true);
    getAssignedVehicles(token, item.id.toString())
      .then((res) => {
        if (res.success) {
          const ids = res.data.map((row) => row.vehicle_id);
          setSelectedForklifts(ids);
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token, item.id]);

  React.useEffect(() => {
    fetchAssignedVehicles();
    fetchVehicles();
  }, [fetchVehicles, fetchAssignedVehicles]);

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
        data={searchedVehicles}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(_) => _.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Forklifts..." />}
        renderItem={({ item: vehicle }) => {
          const checked = selectedForklifts.includes(vehicle.id);
          return (
            <_AssignForkliftListCard
              key={vehicle.id.toString()}
              item={vehicle}
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
