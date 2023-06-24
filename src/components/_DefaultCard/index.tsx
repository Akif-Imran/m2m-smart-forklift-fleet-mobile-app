import React from "react";
import type { CardProps } from "react-native-paper";
import { Card } from "react-native-paper";
import { PaperTheme, gStyles } from "@theme";

type OwnProps = Pick<CardProps, "onPress" | "onLongPress" | "style">;

const _DefaultCard: React.FC<React.PropsWithChildren<OwnProps>> = ({
  children,
  onPress,
  onLongPress,
  style = gStyles.card,
}) => {
  return (
    <Card
      elevation={0}
      mode="elevated"
      theme={PaperTheme}
      style={style}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </Card>
  );
};

export { _DefaultCard };
