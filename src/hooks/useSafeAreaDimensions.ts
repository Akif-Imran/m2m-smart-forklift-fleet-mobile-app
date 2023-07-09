import React from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ISafeAreaDimensions {
  SCREEN_WIDTH: number;
  SCREEN_HEIGHT: number;
  TOP_INSET: number;
  RIGHT_INSET: number;
  BOTTOM_INSET: number;
  LEFT_INSET: number;
  ASPECT_RATIO: number;
  LATITUDE_DELTA: number;
  LONGITUDE_DELTA: number;
}

const LATITUDE_DELTA = 0.0922;
const useSafeAreaDimensions = (): ISafeAreaDimensions => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const {
    bottom: BOTTOM_INSET,
    left: LEFT_INSET,
    right: RIGHT_INSET,
    top: TOP_INSET,
  } = useSafeAreaInsets();

  const { ASPECT_RATIO, LONGITUDE_DELTA } = React.useMemo(() => {
    const ratio = SCREEN_WIDTH / SCREEN_HEIGHT;
    const longitudeDelta = LATITUDE_DELTA * ratio;
    return { ASPECT_RATIO: ratio, LONGITUDE_DELTA: longitudeDelta };
  }, [SCREEN_WIDTH, SCREEN_HEIGHT]);

  return {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    TOP_INSET,
    RIGHT_INSET,
    BOTTOM_INSET,
    LEFT_INSET,
    ASPECT_RATIO,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
  };
};

export { useSafeAreaDimensions };
