import React from "react";
import { StyleProp, View, ViewStyle, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/hooks";
import { Text } from "./themed";
import { useRouter } from "expo-router";

function groupTripsByDate(trips: Trip[]): Record<string, Trip[]> {
  const groupedTrips: Record<string, Trip[]> = {};

  trips.forEach((trip) => {
    const dateKey = getDateKey(trip.date);

    if (!groupedTrips[dateKey]) {
      groupedTrips[dateKey] = [];
    }

    groupedTrips[dateKey].push(trip);
  });

  return groupedTrips;
}

function getDateKey(date: Date): string {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();

  const tripMonth = date.getMonth();
  const tripYear = date.getFullYear();

  // Example of custom period identification
  if (isThisWeek(date)) return "Cette semaine";
  if (tripMonth === currentMonth && tripYear === currentYear)
    return "Ce mois-çi";
  if (tripMonth === currentMonth - 1 && tripYear === currentYear)
    return "Le mois dernier";
  if (tripYear === currentYear - 1) return "L'année dernière";

  // For specific month names
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return tripYear === currentYear ? `${monthNames[tripMonth]}` : `${tripYear}`;
}

function isThisWeek(date: Date): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return date >= startOfWeek && date <= endOfWeek;
}

export const simplifyDuration = (duration: number) =>
  duration > 60 ? `${Math.round(duration / 60)}h` : `${duration}min`;

export function RepeatTripIcon({
  tripsNb,
  style,
}: {
  tripsNb: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { border } = useColors();

  return (
    <View
      style={[{
        flexDirection: "row",
        width: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1.5,
        borderColor: border,
      }, style]}
    >
      <Ionicons
        name={
          tripsNb === 2
            ? "code"
            : tripsNb === 1
            ? "arrow-forward-outline"
            : "close"
        }
        size={tripsNb <= 2 ? 24 : 16}
      />
      <Text style={{ fontSize: 20, fontWeight: "500" }}>
        {tripsNb > 2 && tripsNb}
      </Text>
    </View>
  );
}

export function TripsList({ trips }: { trips: Trip[] | null }) {
  if (!trips || trips.length === 0) {
    return <Text>No trip added yet.</Text>;
  }

  // Grouper les voyages par date
  const groupedTrips = groupTripsByDate(trips);

  return (
    <View style={{ gap: 24 }}>
      {Object.entries(groupedTrips).map(([dateGroup, trips], index) => (
        <View key={index}>
          {/* Titre de la période, comme "this-week", "June 2023", etc. */}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            {dateGroup}
          </Text>

          {/* Liste des voyages pour cette période */}
          {trips.map((trip, key) => {
            const isFirst = key === 0;
            const isLast = key === trips.length - 1;

            return (
              <TripDisplayer
                {...trip}
                key={key}
                style={{
                  borderTopStartRadius: isFirst ? 12 : 0,
                  borderTopEndRadius: isFirst ? 12 : 0,
                  borderBottomStartRadius: isLast ? 12 : 0,
                  borderBottomEndRadius: isLast ? 12 : 0,
                  borderTopWidth: isFirst ? 1.5 : 0,
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function TripDisplayer({
  id,
  from,
  to,
  distance,
  duration,
  repeatTrip,
  style,
}: Trip & { style?: StyleProp<ViewStyle> }) {
  const { border, secondaryTextColor } = useColors();

  const { navigate } = useRouter();

  return (
    <Pressable
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1.5,
          borderRadius: 12,
          paddingRight: 16,
          paddingVertical: 8,
          borderColor: border,
        },
        style,
      ]}
      onPress={() => navigate(`/tripDetails/${id}`)}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <RepeatTripIcon tripsNb={repeatTrip} />

        <View>
          <Text>{from}</Text>
          <Text>{to}</Text>
        </View>
      </View>

      <View>
        <Text style={{ textAlign: "right", color: secondaryTextColor }}>
          {distance * repeatTrip}km
        </Text>
        <Text style={{ textAlign: "right", color: secondaryTextColor }}>
          {simplifyDuration(duration * repeatTrip)}
        </Text>
      </View>
    </Pressable>
  );
}
