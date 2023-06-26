import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import { DashboardStackScreenProps } from "@navigation-types";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { NoIconHeader, _DefaultCard, _PieChart } from "@components";
import { colors, gStyles, theme } from "@theme";

const Dashboard: React.FC<DashboardStackScreenProps<"Dashboard">> = ({}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <NoIconHeader title="Dashboard" />
        <_DefaultCard>
          <View>
            <View>
              <Text style={styles.headerText}>8</Text>
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
              legends={[
                {
                  name: `Operating (${2 || 0})`,
                  labels: { fill: colors.titleText },
                },
                {
                  name: `Parked (${2 || 0})`,
                  labels: { fill: colors.titleText },
                },
                {
                  name: `Faulty (${4 || 0})`,
                  labels: { fill: colors.titleText },
                },
              ]}
              data={[
                {
                  x: "25.0%",
                  y: 25,
                },
                {
                  x: "25.0%",
                  y: 25,
                },
                {
                  x: "50%",
                  y: 50,
                },
              ]}
            />
          </View>
        </_DefaultCard>
        <_DefaultCard>
          <View>
            <View>
              <Text style={styles.headerText}>6</Text>
              <Text style={gStyles.tblHeaderText}>Drivers</Text>
            </View>
            <_PieChart
              direction={"row"}
              origin={{ x: SCREEN_WIDTH / 4, y: 80 }}
              padAngle={0}
              height={160}
              radius={80}
              labelRadius={40}
              innerRadius={18}
              colorScale={[theme.colors.blue[6], theme.colors.pink[6], theme.colors.teal[6]]}
              legends={[
                {
                  name: `Reporting (${2 || 0})`,
                  labels: { fill: colors.titleText },
                },
                {
                  name: `Not Reporting (${4 || 0})`,
                  labels: { fill: colors.titleText },
                },
              ]}
              data={[
                {
                  x: "33.3%",
                  y: 33.3,
                },
                {
                  x: "66.6%",
                  y: 66.6,
                },
              ]}
            />
          </View>
        </_DefaultCard>
        <_DefaultCard>
          <View>
            <View>
              <Text style={styles.headerText}>10</Text>
              <Text style={gStyles.tblHeaderText}>Services</Text>
            </View>
            <_PieChart
              direction={"row"}
              origin={{ x: SCREEN_WIDTH / 4, y: 80 }}
              padAngle={0}
              height={160}
              radius={80}
              labelRadius={40}
              innerRadius={0}
              colorScale={[theme.colors.pink[6], theme.colors.teal[6], theme.colors.violet[6]]}
              legends={[
                {
                  name: `Pending (${2 || 0})`,
                  labels: { fill: colors.titleText },
                },
                {
                  name: `Completed (${4 || 0})`,
                  labels: { fill: colors.titleText },
                },
                {
                  name: `Inprocess (${4 || 0})`,
                  labels: { fill: colors.titleText },
                },
              ]}
              data={[
                {
                  x: "20.0%",
                  y: 20,
                },
                {
                  x: "66.6%",
                  y: 40,
                },
                {
                  x: "40.0%",
                  y: 40,
                },
              ]}
            />
          </View>
        </_DefaultCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export { Dashboard };
