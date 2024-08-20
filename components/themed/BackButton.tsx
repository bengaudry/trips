import { TouchableOpacity, type TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "./Text";
import { useColors } from "@/hooks";

export function BackButton({
  label,
  style,
  ...props
}: TouchableOpacityProps & { label?: string }) {
  const { secondaryTextColor } = useColors();

  return (
    <TouchableOpacity
      style={[{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 12,
      }, style]}
      {...props}
    >
      <Ionicons name="arrow-back" size={22} color={secondaryTextColor} />
      <Text style={{ fontSize: 16, color: secondaryTextColor }}>
        {label ?? "Back"}
      </Text>
    </TouchableOpacity>
  );
}
