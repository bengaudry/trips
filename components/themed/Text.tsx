import { Text as NatText, type TextProps as NatTextProps } from "react-native";

import { useColors } from "@/hooks";

export type TextProps = NatTextProps & {
  secondary?: boolean;
};

export function Text({ style, secondary, ...props }: TextProps) {
  const { primaryTextColor, secondaryTextColor } = useColors();

  return (
    <NatText
      style={[
        { color: secondary ? secondaryTextColor : primaryTextColor },
        style,
      ]}
      {...props}
    />
  );
}
