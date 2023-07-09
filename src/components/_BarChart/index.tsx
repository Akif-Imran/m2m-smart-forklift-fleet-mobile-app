import React from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import { colors } from "@theme";

interface OwnProps {
  x: string;
  y: string;
  color: string;
  height: number;
  domainPadding: number;
  padding: { bottom: number; left: number; right: number; top: number };
  data: Record<string, number>[];
  xAxisTickValues: string[] | number[];
  xAxisTickFormat?:
    | ((...args: unknown[]) => unknown)
    | unknown[]
    | null
    | undefined;
}

export const _BarChart: React.FC<OwnProps> = ({
  data,
  x,
  y,
  color,
  xAxisTickValues: xAxisTickValues,
  xAxisTickFormat: xAxisTickFormat,
  height,
  domainPadding,
  padding,
}) => (
  <VictoryChart
    theme={VictoryTheme.material}
    domainPadding={domainPadding}
    padding={padding}
    height={height}
    containerComponent={
      <VictoryVoronoiContainer
        responsive={true}
        labels={({ datum }) =>
          `Date: ${datum.x},\r\nProduction: ${datum.y.toFixed(1)}`
        }
        labelComponent={
          <VictoryTooltip style={{ fontSize: 10 }} orientation={"bottom"} />
        }
      />
    }
  >
    <VictoryAxis
      tickValues={xAxisTickValues}
      tickFormat={xAxisTickFormat}
      tickLabelComponent={
        <VictoryLabel angle={-30} textAnchor={"end"} style={{ fontSize: 8 }} />
      }
      style={{
        axis: {
          stroke: colors.iconGray,
        },
        ticks: {
          stroke: colors.iconGray,
          size: 8,
        },
        grid: {
          display: "none",
        },
      }}
    />
    <VictoryAxis
      dependentAxis
      tickLabelComponent={
        <VictoryLabel
          textAnchor={"end"}
          style={{
            fontSize: 10,
            stroke: colors.mediumGray,
            strokeWidth: 0.4,
          }}
        />
      }
      style={{
        axis: {
          stroke: colors.iconGray,
        },
        ticks: {
          stroke: colors.iconGray,
          size: 8,
        },
        // grid: {
        //   display: "none",
        // },
      }}
    />
    <VictoryBar data={data} x={x} y={y} style={{ data: { fill: color } }} />
  </VictoryChart>
);
