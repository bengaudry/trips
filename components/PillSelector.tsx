import {
  ScrollView,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { InputLabel, Text } from "./themed";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks";

function PillOption({
  label,
  icon,
  isSelected,
  onPress,
}: {
  label: string;
  icon?: string;
  isSelected?: boolean;
  onPress: () => void;
}) {
  const {
    appBackground,
    border,
    accent,
    subtleBackground,
    primaryTextColor,
    invertedPrimaryTextColor,
  } = useColors();

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1.5,
        borderColor: isSelected ? accent : border,
        backgroundColor: isSelected ? accent : subtleBackground,
        paddingLeft: icon ? 4 : 16,
        paddingRight: 16,
        paddingVertical: icon ? 4 : 8,
        borderRadius: 9999,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
      onPress={onPress}
    >
      {icon && (
        <View
          style={{
            backgroundColor: appBackground,
            borderRadius: 9999,
            padding: 5,
          }}
        >
          {/* @ts-ignore */}
          <Ionicons name={icon} size={18} />
        </View>
      )}
      <Text
        style={{
          fontWeight: "500",
          color: isSelected ? invertedPrimaryTextColor : primaryTextColor,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function PillSelector<T extends any>(
  selectorProps: ViewProps & {
    label: string;
    items: Array<{ value: T; label: string; icon?: string }>;
    value: T;
    onChange: (value: T) => void;
    debugMode?: boolean;
  }
) {
  return (
    <View {...selectorProps}>
      {selectorProps.debugMode && (
        <Text>Current value : {JSON.stringify(selectorProps.value)}</Text>
      )}
      <InputLabel label={selectorProps.label} style={{ marginBottom: 4 }} />
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingBottom: 12,
        }}
      >
        {selectorProps.items.map(({ value, label, icon }, index) => (
          <PillOption
            key={index}
            onPress={() => selectorProps.onChange(value)}
            isSelected={value === selectorProps.value}
            label={selectorProps.debugMode ? JSON.stringify(value) : label}
            icon={icon}
          />
        ))}
      </ScrollView>
    </View>
  );
}
