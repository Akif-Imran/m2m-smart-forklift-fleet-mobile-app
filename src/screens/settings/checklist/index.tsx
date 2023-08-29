import { FlatList, RefreshControl, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, theme } from "@theme";
import { Searchbar } from "react-native-paper";
import { _ListEmptyComponent } from "@components";
import { useAuthContext } from "@context";
import { getCheckList } from "@services";
import { ToastService } from "@utility";

import { _ChecklistListCard } from "../components";

const Checklist = () => {
  const {
    state: { token },
  } = useAuthContext();
  const [isFetching, setIsFetching] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [checklist, setChecklist] = React.useState<IChecklist[]>([]);
  const [searchedChecklist, setSearchedChecklist] = React.useState<
    IChecklist[]
  >([]);

  const handleSearch = (query: string) => {
    console.log(query);
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchChecklist(true);
  };

  const fetchChecklist = React.useCallback(
    (withLoader = false) => {
      setIsFetching(withLoader);
      getCheckList(token)
        .then((res) => {
          if (res.success) {
            setChecklist((_prev) => res.data);
          }
        })
        .catch((_err) => {
          console.log(_err?.message);
          ToastService.show("Error fetching checklist");
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    [token]
  );

  React.useEffect(() => {
    fetchChecklist(true);
  }, [fetchChecklist]);

  React.useEffect(() => {
    setSearchedChecklist((_prev) => checklist);
  }, [checklist]);

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
        data={searchedChecklist}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Services..." />}
        renderItem={({ item }) => (
          <_ChecklistListCard
            key={item.id}
            label={item.name}
            checklistItemId={item.id}
            handleRefresh={handleRefresh}
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

export { Checklist };
