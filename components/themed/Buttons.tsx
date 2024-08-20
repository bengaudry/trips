import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  Text,
  type TextProps,
  View,
  TextStyle,
  ViewStyle,
  type StyleProp,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/hooks";

export function ButtonLabel({
  style,
  color,
  ...props
}: TextProps & { color: string }) {
  return <Text style={[styles.ButtonLabel, { color }, style]} {...props} />;
}

export type CTAProps = TouchableOpacityProps & {
  content: string;
  icon?: string;
  textStyle?: StyleProp<TextStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  gradientColors?: Array<string>;
  loading?: boolean;
  type?: "default" | "success" | "info" | "warning" | "danger";
  secondary?: boolean;
  Before?: () => JSX.Element;
  After?: () => JSX.Element;
};

export function CTA({
  style,
  content,
  children,
  icon,
  innerStyle,
  textStyle,
  gradientColors,
  disabled,
  loading,
  secondary,
  Before,
  After,
  type = "default",
  ...props
}: CTAProps) {
  const { shadow, invertedPrimaryTextColor } = useColors();
  const scheme = useColorScheme();

  const defaultBgColors = ["#430FBA", "#1D0094"];
  const dangerBgColors = ["rgba(219, 43, 15, 1)", "rgba(173, 34, 12, 1)"];
  const warningBgColors = ["rgba(255, 193, 7, 1)", "rgba(204, 156, 14, 1)"];
  const infoBgColors = ["rgba(0, 123, 255, 1)", "rgba(0, 87, 181, 1)"];
  const successBgColors = ["rgba(40, 167, 69, 1)", "rgba(27, 117, 48, 1)"];

  const [bgColors, setBgColors] = useState(gradientColors ?? defaultBgColors);

  useEffect(() => {
    if (type === "danger") return setBgColors(dangerBgColors);
    if (type === "warning") return setBgColors(warningBgColors);
    if (type === "info") return setBgColors(infoBgColors);
    if (type === "success") return setBgColors(successBgColors);
    return setBgColors(gradientColors ?? defaultBgColors);
  }, [type, scheme]);

  return (
    <TouchableOpacity
      style={[
        styles.CtaTouchZone,
        {
          shadowColor: shadow,
          shadowOpacity: disabled ? 0 : 0.3,
          opacity: disabled ? 0.2 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      <LinearGradient
        style={[styles.CtaGradientBackground, { opacity: secondary ? 0.2 : 1 }]}
        colors={bgColors}
      />
      <View style={[styles.CtaLabelContainer, innerStyle]}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Before && <Before />}
            <ButtonLabel
              color={secondary ? bgColors[0] : invertedPrimaryTextColor}
            >
              {content}
            </ButtonLabel>
            {After && <After />}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  CtaTouchZone: {
    position: "relative",
    width: "100%",
    display: "flex",
    borderCurve: "continuous",
    shadowRadius: 16,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  CtaGradientBackground: {
    position: "absolute",
    borderRadius: 12,
    width: "100%",
    height: "100%",
  },
  CtaLabelContainer: { paddingHorizontal: 32, paddingVertical: 16 },
  ButtonLabel: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
});
