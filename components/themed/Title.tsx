import { StyleSheet } from "react-native";

import { Text, type TextProps } from "./Text";

export type TitleProps = TextProps & {
  heading?: "screen" | "heading" | "subtitle";
};

export function Title({
  style,
  heading = "heading",
  secondary,
  ...props
}: TitleProps) {
  return (
    <Text
      style={[styles[heading], style]}
      secondary={secondary ?? heading === "subtitle"}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  screen: { fontSize: 32, fontWeight: "700", marginBottom: 16 },
  heading: {
    fontSize: 22,
    marginBottom: 6,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 19,
    fontWeight: "400",
    marginBottom: 32,
  },
});
