import { FlatList, RefreshControl } from "react-native";
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import {
  NoIconHeader,
  _ConfirmModal,
  _DefaultCard,
  _Divider,
  _ListEmptyComponent,
} from "@components";
import { colors, gStyles } from "@theme";
import { FAB } from "react-native-paper";
import { ToastService } from "@utility";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { deleteVehicle, getDashCounts } from "@services";
import { useAuthContext, useTaskContext } from "@context";
import { useIsFocused } from "@react-navigation/native";
import {
  selectVehiclesWithDevices,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { deleteVehicle as deleteVehicleRedux } from "@slices";
import { fetchDevices, fetchVehicles } from "@thunks";

import { _ForkliftListCard } from "../components";

import { _ListHeader } from "./_ListHeader";

const Forklift: React.FC<ForkliftStackScreenProps<"Forklift">> = ({
  navigation,
}) => {
  const isFocused = useIsFocused();
  const {
    state: { token, isAdmin, isDriver, user },
  } = useAuthContext();
  const {
    state: { inProgress },
  } = useTaskContext();
  const dispatch = useAppDispatch();
  const { data: forklifts, isLoading } = useAppSelector(
    selectVehiclesWithDevices
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searchedForklifts, setSearchedForklifts] = React.useState<
    IVehicleWithDevice[]
  >([]);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const [toBeDeletedVehicleId, setToBeDeletedVehicleId] =
    React.useState<number>(0);
  const [counts, setCounts] = React.useState<ForkliftCounts>({
    moving: 0,
    offline: 0,
    parked: 0,
    total: 0,
  });
  const handleRefresh = () => {
    dispatch(fetchVehicles(token));
    dispatch(fetchDevices(token));
  };

  const handleSearch = React.useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setSearchedForklifts(forklifts);
        return;
      }
      const filtered = forklifts.filter((forklift) =>
        forklift.reg_no.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedForklifts(filtered);
    },
    [forklifts]
  );

  const handleDelete = React.useCallback((vehicleId: number) => {
    setToBeDeletedVehicleId(vehicleId);
    setConfirmDeleteVisible(true);
    console.log("handle delete", vehicleId);
  }, []);

  const handleDeleteConfirm = () => {
    deleteVehicle(token, toBeDeletedVehicleId.toString())
      .then((res) => {
        ToastService.show(res?.message || "");
        if (res.success) {
          dispatch(deleteVehicleRedux(toBeDeletedVehicleId));
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      })
      .finally(() => {
        setConfirmDeleteVisible(false);
      });
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteVisible(false);
  };

  const fetchCounts = React.useCallback(() => {
    getDashCounts(token)
      .then((res) => {
        console.log(res);
        if (res.success) {
          const { moving, parked, total_vehicles: total, offline } = res.data;
          setCounts((prev) => ({
            ...prev,
            moving,
            parked,
            total,
            offline,
          }));
        }
      })
      .catch((_err) => {
        ToastService.show("Counts Error");
      });
  }, [token]);

  React.useEffect(() => {
    if (!forklifts) {
      return;
    }
    setSearchedForklifts(forklifts);
  }, [forklifts]);

  React.useEffect(() => {
    if (!token) {
      return;
    }
    if (!isDriver) {
      fetchCounts();
    }
    // dispatch(fetchDevices(token));
  }, [token, fetchCounts, isFocused, isDriver]);

  const right = [
    {
      icon: <Ionicons name="notifications" size={24} color={colors.primary} />,
      onPress: () => navigation.navigate("Notification"),
    },
  ];
  if (isDriver) {
    if (inProgress) {
      right.push({
        icon: (
          <MaterialCommunityIcons
            name="progress-clock"
            size={24}
            color={colors.error}
          />
        ),
        onPress: user?.available_status
          ? () => navigation.navigate("DriverTask")
          : () => ToastService.show("You are not available to work"),
      });
    } else {
      right.push({
        icon: (
          <MaterialCommunityIcons
            name="barcode-scan"
            size={24}
            color={colors.primary}
          />
        ),
        onPress: user?.available_status
          ? () => navigation.navigate("BarcodeScanner")
          : () => ToastService.show("You are not available to work"),
      });
    }
  }

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader
        title="Vehicles"
        left={[
          {
            icon: (
              <FontAwesome5
                name="map-marked-alt"
                size={24}
                color={colors.primary}
              />
            ),
            onPress: () =>
              navigation.navigate("BirdEyeView", {
                mode: "multiple",
              }),
          },
        ]}
        right={right}
      />
      <_ConfirmModal
        visible={confirmDeleteVisible}
        question="Are you sure you want to delete this vehicle ?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <FlatList
        data={searchedForklifts}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item.id.toString()}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <_ListHeader
            counts={counts}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
          />
        )}
        ListEmptyComponent={<_ListEmptyComponent label="No Forklifts..." />}
        renderItem={({ item }) => (
          <_ForkliftListCard
            key={item.id.toString()}
            item={item}
            handleDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={isLoading}
            colors={[colors.primary]}
            progressBackgroundColor={colors.white}
            onRefresh={handleRefresh}
          />
        }
      />
      {isAdmin && (
        <FAB
          icon="plus"
          style={gStyles.fab}
          color={colors.white}
          // onLongPress={() => addInfo()}
          onPress={() =>
            navigation.navigate("AddForklift", {
              mode: "add",
            })
          }
        />
      )}
    </SafeAreaView>
  );
};

export { Forklift };
