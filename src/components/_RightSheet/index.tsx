import { Dimensions, StyleSheet } from "react-native";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import { colors } from "@theme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const MAX_TRANSLATE_X = SCREEN_WIDTH / 6;
export const MIN_TRANSLATE_X = SCREEN_WIDTH / 1;

interface RightSheetProps {
  height?: number;
  initialPosition: "open" | "close";
}

export interface RightSheetRefProps {
  scrollTo: (destination: number) => void;
}

const _RightSheet = React.forwardRef<
  RightSheetRefProps,
  React.PropsWithChildren<RightSheetProps>
>(({ children, height, initialPosition }, ref) => {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    console.log("called valued", destination);
    translateX.value = withTiming(destination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({ scrollTo }), [scrollTo]);

  useLayoutEffect(() => {
    scrollTo(MIN_TRANSLATE_X);
  }, [scrollTo]);

  useEffect(() => {
    // moved to use layoutEffect
    // translateX.value = withTiming(MIN_TRANSLATE_X);
    // scrollTo(MIN_TRANSLATE_X);
    let openBottomSheet: NodeJS.Timer;
    if (initialPosition === "open") {
      openBottomSheet = setTimeout(() => {
        scrollTo(MAX_TRANSLATE_X);
        // translateX.value = withTiming(MAX_TRANSLATE_X);
      }, 2000);
    }
    return () => {
      if (initialPosition === "open") {
        clearTimeout(openBottomSheet);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      console.log(event.translationX + context.value.x);
      translateX.value = Math.max(translateX.value, MAX_TRANSLATE_X);
    })
    .onEnd(() => {
      console.log("max", MAX_TRANSLATE_X);
      console.log("end", translateX.value);
      console.log("min", MIN_TRANSLATE_X);
      if (translateX.value > context.value.x) {
        scrollTo(MIN_TRANSLATE_X);
        // translateX.value = withTiming(MIN_TRANSLATE_X);
      } else if (translateX.value < context.value.x) {
        scrollTo(MAX_TRANSLATE_X);
        // translateX.value = withTiming(MAX_TRANSLATE_X);
      }
    });

  const bottomSheetAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.rightSheetContainer,
          bottomSheetAnimatedStyles,
          height ? { height } : null,
        ]}
      >
        {/* <View style={styles.line} /> */}
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

export { _RightSheet };

const styles = StyleSheet.create({
  rightSheetContainer: {
    width: SCREEN_WIDTH / 1.2,
    position: "absolute",
    backgroundColor: colors.white,
    borderColor: colors.warning,
    zIndex: 12,
    // borderWidth: 1,
  },
  line: {
    width: 25,
    height: 4,
    backgroundColor: colors.titleText,
    marginVertical: 12,
    borderRadius: 2,
    alignSelf: "center",
  },
  // tab: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingHorizontal: 15,
  //   paddingVertical: 4,
  //   textAlignVertical: "center",
  //   borderRadius: 15,
  //   backgroundColor: colors.mediumGray,
  //   // marginHorizontal: 4,
  //   // marginVertical: 15,
  //   fontFamily: "Visby-Bold",
  // },
  // activeTab: {
  //   color: colors.secondary,
  // },
});
