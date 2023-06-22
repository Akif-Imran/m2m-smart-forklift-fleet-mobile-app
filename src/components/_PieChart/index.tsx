import { Dimensions, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryTheme,
} from "victory-native";
import { colors } from "../../theme";

const { width } = Dimensions.get("window");

interface OwnProps {
  direction: "row" | "column";
  height?: number;
  radius?: number;
  innerRadius?: number;
  padAngle?: number;
  labelRadius?: number;
  data: {
    x: number | string;
    y: number;
    label?: string;
  }[];
  legends: { name: string; labels: { fill: string } }[];
  colorScale?: string[];
  origin?: { x: number; y: number };
}
export const _PieChart: React.FC<OwnProps> = ({
  direction,
  legends,
  colorScale,
  data,
  height = 100,
  innerRadius = 10,
  labelRadius = 15,
  padAngle = 0.4,
  radius = 50,
  origin = { x: width / 4, y: 50 },
}) => {
  const colorsScale = colorScale
    ? colorScale
    : [
        "#FA5252",
        "#15AABF",
        "#40C057",
        "#4C6EF5",
        "#228BE6",
        "#FAB005",
        "#7950F2",
        "#BE4BDB",
        "#12B886",
      ];
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  return (
    <View style={[styles.mainContainer, direction === "row" ? styles.row : styles.column]}>
      <VictoryPie
        height={height}
        standalone={true}
        innerRadius={innerRadius}
        radius={radius}
        padAngle={padAngle}
        labelRadius={labelRadius}
        // labelComponent={<VictoryLabel />}
        origin={origin}
        // origin={{ x: SCREEN_WIDTH / 4, y: 50 }}
        containerComponent={
          <VictoryContainer
            style={styles.victoryContainerStyles}
            responsive={true}
            preserveAspectRatio="none"
          />
        }
        colorScale={colorsScale}
        data={data}
        // animate={{
        //   duration: 1000,
        // }}
        style={{
          labels: {
            fill: "white",
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
      />
      <VictoryChart
        style={{
          parent: {
            flex: 1,
            maxHeight: 50,
          },
        }}
        theme={VictoryTheme.material}
        containerComponent={<VictoryContainer preserveAspectRatio="none" responsive={true} />}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "none" },
            ticks: { display: "none" },
            grid: { display: "none" },
            tickLabels: { display: "none" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "none" },
            ticks: { display: "none" },
            grid: { display: "none" },
            tickLabels: { display: "none" },
          }}
        />
        <VictoryLegend
          standalone={false}
          borderPadding={{ bottom: 0, left: 0, right: 0, top: 0 }}
          domainPadding={{ x: 0, y: 0 }}
          orientation="vertical"
          containerComponent={<VictoryContainer responsive={true} />}
          gutter={10}
          padding={{ bottom: 0, left: 0, right: 0, top: 0 }}
          style={{
            labels: {
              color: colors.titleText,
              fontSize: 10,
            },
          }}
          colorScale={colorsScale}
          data={legends}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // flexDirection: direction,
    // borderWidth: 1,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  victoryContainerStyles: {
    flex: 1,
  },
});

// const CustomLabel: React.FC = (props) => {
//   console.log("custom lable", props);
//   return <Text>{props.text}</Text>;
// };
