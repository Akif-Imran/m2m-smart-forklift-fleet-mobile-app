import { FlatList, RefreshControl, View } from "react-native";
import React from "react";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, theme } from "@theme";
import { _ListEmptyComponent } from "@components";
import { Searchbar } from "react-native-paper";
import { useAuthContext } from "@context";
import { selectVehicles, useAppDispatch, useAppSelector } from "@store";
import { fetchVehicles } from "@thunks";

import { _ForkliftListCard } from "../components";

const VehicleIcons: React.FC<
  ProfileSettingsStackScreenProps<"VehicleIcons">
> = ({}) => {
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { data: forklifts, isLoading } = useAppSelector(selectVehicles);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searchedForklifts, setSearchedForklifts] = React.useState<IVehicle[]>(
    []
  );
  const handleRefresh = () => {
    dispatch(fetchVehicles(token));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedForklifts(forklifts.rows);
      return;
    }
    const filteredCustomers = forklifts.rows.filter((vehicle) =>
      vehicle.reg_no.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedForklifts(filteredCustomers);
  };

  React.useEffect(() => {
    if (!forklifts) {
      return;
    }
    setSearchedForklifts(forklifts.rows);
  }, [forklifts]);

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
            refreshing={isLoading}
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
