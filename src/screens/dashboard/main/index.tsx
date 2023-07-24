/* eslint-disable camelcase */
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import type { DashboardStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { NoIconHeader, _DefaultCard, _PieChart } from "@components";
import { colors, gStyles, theme } from "@theme";
import { getDashCounts, getServiceCounts } from "@services";
import { useAuthContext } from "@context";
import { ToastService } from "@utility";
import { useIsFocused } from "@react-navigation/native";

import { styles } from "./styles";

type IData = { x: string; y: number }[];
type ILegend = {
  name: string;
  labels: {
    fill: string;
  };
}[];
type DashState = {
  data: IData;
  legends: ILegend;
  total: number;
};
const defaultState: DashState = {
  data: [],
  legends: [],
  total: 0,
};
const Dashboard: React.FC<DashboardStackScreenProps<"Dashboard">> = ({}) => {
  const {
    state: { token },
  } = useAuthContext();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isFocused = useIsFocused();
  const [isFetching, setIsFetching] = React.useState(false);
  const [serviceCounts, setServiceCounts] =
    React.useState<DashState>(defaultState);
  const [vehicleCounts, setVehicleCounts] =
    React.useState<DashState>(defaultState);
  const [driverCounts, setDriverCounts] =
    React.useState<DashState>(defaultState);

  const getPercentage = (value: number, total: number) => {
    if (total === 0) {
      return { x: "0", y: 0 };
    }
    const percentage = (value / total) * 100;
    return { x: `${percentage.toFixed(1)}`, y: percentage };
  };
  const fetchServiceCounts = React.useCallback(() => {
    getServiceCounts(token)
      .then((res) => {
        console.log(res);
        if (res.success) {
          const total =
            res.data.Completed + res.data["In Process"] + res.data.Pending;
          const data = Object.entries(res.data)
            .map(([_, value]) => getPercentage(value, total))
            .filter((value) => value.y > 0);
          const legends = [
            {
              name: `Pending (${res.data.Pending || 0})`,
              labels: { fill: colors.titleText },
            },
            {
              name: `Completed (${res.data.Completed || 0})`,
              labels: { fill: colors.titleText },
            },
            {
              name: `In Process (${res.data["In Process"] || 0})`,
              labels: { fill: colors.titleText },
            },
          ];
          setServiceCounts((prev) => ({ ...prev, data, legends, total }));
        }
      })
      .catch((_err) => {
        ToastService.show("Service count Error");
      });
  }, [token]);

  const fetchDashCounts = React.useCallback(() => {
    getDashCounts(token)
      .then((res) => {
        if (res.success) {
          const {
            moving,
            parked,
            offline,
            total_vehicles,
            driver_available,
            driver_unavailable,
            total_driver,
          } = res.data;
          const totalVehicles = total_vehicles;
          const vehicleData = Object.entries(res.data)
            .map(([key, value]) => {
              if (["moving", "parked", "offline"].includes(key)) {
                console.log(key, value);
                return getPercentage(value, totalVehicles);
              }
              return { x: "", y: 0 };
            })
            .filter((value) => value?.y > 0);
          const vehicleLegends = [
            {
              name: `Moving (${moving || 0})`,
              labels: { fill: colors.titleText },
            },
            {
              name: `Parked (${parked || 0})`,
              labels: { fill: colors.titleText },
            },
            {
              name: `Offline (${offline || 0})`,
              labels: { fill: colors.titleText },
            },
          ];
          setVehicleCounts((prev) => ({
            ...prev,
            data: vehicleData,
            legends: vehicleLegends,
            total: totalVehicles,
          }));
          //------driver counts------
          const driverData = Object.entries(res.data)
            .map(([key, value]) => {
              if (["driver_available", "driver_unavailable"].includes(key)) {
                console.log(key, value);
                return getPercentage(value, total_driver);
              }
              return { x: "", y: 0 };
            })
            .filter((value) => value?.y > 0);
          const driverLegends = [
            {
              name: `Available (${driver_available || 0})`,
              labels: { fill: colors.titleText },
            },
            {
              name: `Unavailable (${driver_unavailable || 0})`,
              labels: { fill: colors.titleText },
            },
          ];
          setDriverCounts((prev) => ({
            ...prev,
            data: driverData,
            legends: driverLegends,
            total: total_driver,
          }));
        }
      })
      .catch((err) => {
        ToastService.show("Dashboard count Error");
        console.log(err?.message);
      });
  }, [token]);

  const handleRefresh = () => {
    setIsFetching(true);
    fetchServiceCounts();
    fetchDashCounts();
    setIsFetching(false);
  };

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchServiceCounts();
    fetchDashCounts();
  }, [isFocused, fetchServiceCounts, fetchDashCounts]);

  console.log(serviceCounts);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={isFetching}
            colors={[colors.primary]}
            progressBackgroundColor={colors.white}
            onRefresh={handleRefresh}
          />
        }
      >
        <NoIconHeader title="Dashboard" />
        <_DefaultCard>
          <View>
            <View>
              <Text style={styles.headerText}>{vehicleCounts.total}</Text>
              <Text style={gStyles.tblHeaderText}>Forklifts</Text>
            </View>
            <_PieChart
              direction={"row"}
              origin={{ x: SCREEN_WIDTH / 4, y: 80 }}
              padAngle={0}
              height={160}
              radius={80}
              labelRadius={40}
              innerRadius={0}
              colorScale={["#5C7CFA", "#20C997", "#845EF7", "#339AF0"]}
              legends={vehicleCounts.legends}
              data={vehicleCounts.data}

              // legends={[
              //   {
              //     name: `Operating (${2 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              //   {
              //     name: `Parked (${2 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              //   {
              //     name: `Faulty (${4 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              // ]}
              // data={[
              //   {
              //     x: "25.0%",
              //     y: 25,
              //   },
              //   {
              //     x: "25.0%",
              //     y: 25,
              //   },
              //   {
              //     x: "50%",
              //     y: 50,
              //   },
              // ]}
            />
          </View>
        </_DefaultCard>
        <_DefaultCard>
          <View>
            <View>
              <Text style={styles.headerText}>{driverCounts.total}</Text>
              <Text style={gStyles.tblHeaderText}>Drivers</Text>
            </View>
            <_PieChart
              direction={"row"}
              origin={{ x: SCREEN_WIDTH / 4, y: 80 }}
              padAngle={0}
              height={160}
              radius={80}
              labelRadius={40}
              innerRadius={16}
              colorScale={[
                theme.colors.blue[6],
                theme.colors.pink[6],
                theme.colors.teal[6],
              ]}
              legends={driverCounts.legends}
              data={driverCounts.data}
              // legends={[
              //   {
              //     name: `Reporting (${2 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              //   {
              //     name: `Not Reporting (${4 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              // ]}
              // data={[
              //   {
              //     x: "33.3%",
              //     y: 33.3,
              //   },
              //   {
              //     x: "66.6%",
              //     y: 66.6,
              //   },
              // ]}
            />
          </View>
        </_DefaultCard>
        <_DefaultCard>
          <View>
            <View>
              <Text style={styles.headerText}>{serviceCounts.total}</Text>
              <Text style={gStyles.tblHeaderText}>Services</Text>
            </View>
            <_PieChart
              direction={"row"}
              origin={{ x: SCREEN_WIDTH / 4, y: 80 }}
              padAngle={0}
              height={160}
              radius={80}
              labelRadius={40}
              innerRadius={16}
              colorScale={[
                theme.colors.pink[6],
                theme.colors.teal[6],
                theme.colors.violet[6],
              ]}
              legends={serviceCounts.legends}
              data={serviceCounts.data}
              // legends={[
              //   {
              //     name: `Pending (${2 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              //   {
              //     name: `Completed (${4 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              //   {
              //     name: `Inprocess (${4 || 0})`,
              //     labels: { fill: colors.titleText },
              //   },
              // ]}
              // data={[
              //   {
              //     x: "20.0%",
              //     y: 20,
              //   },
              //   {
              //     x: "66.6%",
              //     y: 40,
              //   },
              //   {
              //     x: "40.0%",
              //     y: 40,
              //   },
              // ]}
            />
          </View>
        </_DefaultCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export { Dashboard };
