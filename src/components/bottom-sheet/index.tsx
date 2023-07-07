import { Dimensions, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { colors } from "../../theme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { screenStyles } from "@screen-styles";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
export const MAX_TRANSLATE_Y = -SCREEN_HEIGHT / 2;
export const MIN_TRANSLATE_Y = SCREEN_HEIGHT;

interface BottomSheetProps {}
export interface BottomSheetRef {
  scrollTo: (destination: number) => void;
}

const _BottomSheet = React.forwardRef<BottomSheetRef, React.PropsWithChildren<BottomSheetProps>>(
  ({ children }, ref) => {
    // const { translateY, context } = useBottomSheetContext();
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    const scrollTo = useCallback((destination: number) => {
      "worklet";
      translateY.value = withTiming(destination);
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo }), [scrollTo]);

    useEffect(() => {
      scrollTo(MIN_TRANSLATE_Y);
      return () => {};
    }, []);

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        // console.log(event.translationY + context.value.y);
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        /* console.log('max', MAX_TRANSLATE_Y);
      console.log('end', translateY.value);
      console.log('min', MIN_TRANSLATE_Y); */
        if (translateY.value > context.value.y) {
          scrollTo(MIN_TRANSLATE_Y);
        } else if (translateY.value < context.value.y) {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    const bottomSheetAnimatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, bottomSheetAnimatedStyles]}>
          <View style={styles.line} />
          {children}
        </Animated.View>
      </GestureDetector>
    );
  }
);

export { _BottomSheet };

const styles = StyleSheet.create({
  bottomSheetContainer: {
    // paddingHorizontal: values.paddingHorizontal,
    height: SCREEN_HEIGHT,
    top: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: "absolute",
    marginBottom: 70,
    backgroundColor: colors.white,
    borderRadius: 25,
    borderColor: colors.borderColor,
    ...screenStyles.shadow,
    // borderWidth: 1,
  },
  line: {
    width: 25,
    height: 4,
    backgroundColor: colors.iconGray,
    marginVertical: 12,
    borderRadius: 2,
    alignSelf: "center",
  },
});
