import {
  ScrollView,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { InputLabel, Text } from "./themed";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks";
import { useEffect, useState } from "react";

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
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        flexGrow: 1,
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
          <Ionicons name={icon} size={26} />
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

export function MultiSelector<T extends any>({
  style,
  ...selectorProps
}: ViewProps & {
  label: string;
  items: Array<{ value: T; label: string; icon?: string }>;
  defaultValues?: Array<T>;
  onChange: (newSelectedValues: Array<T>) => void;
  max?: number;
  min?: number;
}) {
  if (selectorProps.max && selectorProps.max <= 1)
    throw "Prop value <max> should be higher than 1";
  if (selectorProps.min && selectorProps.min < 0)
    throw "Prop value <min> should be higher or equal than 0";

  const [selectedValues, setSelectedValues] = useState<T[]>(
    selectorProps.defaultValues ?? []
  );
  const [error, setError] = useState("");

  useEffect(() => {
    selectorProps.onChange(selectedValues);
  }, [selectedValues]);

  return (
    <View {...selectorProps} style={[{ marginBottom: 16 }, style]}>
      <InputLabel label={selectorProps.label} style={{ marginBottom: 4 }} />
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingBottom: 4,
        }}
      >
        {selectorProps.items.map(({ value, label, icon }, index) => (
          <PillOption
            key={index}
            onPress={() => {
              setError("");
              const newSelectedValues = [...selectedValues];
              if (selectedValues.includes(value)) {
                if (
                  selectorProps.min &&
                  selectedValues.length === selectorProps.min
                )
                  return setError(
                    `Au moins ${selectorProps.min} cases doivent être selectionnées`
                  );
                newSelectedValues.splice(newSelectedValues.indexOf(value), 1);
              } else {
                if (
                  selectorProps.max &&
                  selectedValues.length === selectorProps.max
                )
                  return setError(
                    `Seulement ${selectorProps.max} options peuvent être selectionnées`
                  );
                newSelectedValues.push(value);
              }
              setSelectedValues(newSelectedValues);
            }}
            isSelected={selectedValues.includes(value)}
            label={label}
            icon={icon}
          />
        ))}
      </ScrollView>
      {error && (
        <Text style={{ color: "red", fontWeight: "500" }}>{error}</Text>
      )}
    </View>
  );
}
