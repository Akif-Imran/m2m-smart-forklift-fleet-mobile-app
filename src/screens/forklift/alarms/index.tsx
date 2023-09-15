import { FlatList, RefreshControl, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { _ConfirmModal, _ListEmptyComponent } from "@components";
import { screenStyles } from "@screen-styles";
import { colors, theme } from "@theme";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import { getAlarmReport } from "@services";
import { useAuthContext } from "@context";
import moment from "moment";

import { _AlarmListCard } from "../components";

const ForkliftAlarms: React.FC<ForkliftStackScreenProps<"Alarms">> = ({
  route,
}) => {
  const { IMEI } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const [alarms, setAlarms] = React.useState<IAlarmReport[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const handleRefresh = () => {
    fetchAlarms();
  };

  const fetchAlarms = React.useCallback(() => {
    setIsFetching(true);
    getAlarmReport(token, {
      startDate: moment({ year: 2023, month: 8, date: 1 }).format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      IMEI: IMEI,
    })
      .then((res) => {
        console.log(res);
        if (res.success) {
          setAlarms(res.result.rows);
        }
      })
      .catch((_err) => {
        ToastService.show(_err.message || "");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token, IMEI]);

  React.useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ marginTop: theme.header.height }} />
      <FlatList
        data={alarms}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Notifications..." />}
        renderItem={({ item }) => <_AlarmListCard key={item.id} item={item} />}
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

export { ForkliftAlarms };
