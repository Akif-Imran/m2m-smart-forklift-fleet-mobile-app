import { _DefaultCard, _Divider } from "@components";
import { ForkliftStatusColor } from "@constants";
import { screenStyles } from "@screen-styles";
import { PaperTheme, gStyles } from "@theme";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Searchbar } from "react-native-paper";

interface OwnProps {
  counts: ForkliftCounts;
  searchQuery: string;
  handleSearch: (query: string) => void;
}

const ListHeaderComponent: React.FC<OwnProps> = ({
  counts,
  searchQuery,
  handleSearch,
}) => {
  return (
    <>
      <_DefaultCard>
        <View style={screenStyles.countRow}>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>{counts.moving}</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ForkliftStatusColor.moving,
              })}
            >
              Moving
            </Text>
          </View>
          <View
            style={StyleSheet.compose(screenStyles.countRowMiddleItem, {
              borderRightWidth: 0,
            })}
          />
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>{counts.parked}</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ForkliftStatusColor.parked,
              })}
            >
              Parked
            </Text>
          </View>
        </View>
        <_Divider />
        <View style={screenStyles.countRow}>
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>{counts.total}</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ForkliftStatusColor.total,
              })}
            >
              Total
            </Text>
          </View>
          <View
            style={StyleSheet.compose(screenStyles.countRowMiddleItem, {
              borderRightWidth: 0,
            })}
          />
          <View style={screenStyles.countRowItem}>
            <Text style={gStyles.headerText}>{counts.offline}</Text>
            <Text
              style={StyleSheet.compose(screenStyles.countInfoText, {
                color: ForkliftStatusColor.offline,
              })}
            >
              Offline
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
    </>
  );
};

const areEqual = (
  prev: Readonly<OwnProps>,
  next: Readonly<OwnProps>
): boolean => {
  return (
    prev.counts.moving === next.counts.moving &&
    prev.counts.offline === next.counts.offline &&
    prev.counts.parked === next.counts.parked &&
    prev.counts.total === next.counts.total &&
    prev.handleSearch === next.handleSearch &&
    prev.searchQuery === next.searchQuery
  );
};

export const _ListHeader = React.memo(ListHeaderComponent, areEqual);
