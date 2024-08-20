import { useEffect, useState } from "react";
import { ActionSheetIOS, Platform, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { deleteTrip, getTripDetails } from "@/api/trips";
import { CTA, RepeatTripIcon, Text } from "@/components";
import { useColors } from "@/hooks";

function NbWithLabel({ nb, label }: { nb: number | undefined; label: string }) {
  const { secondaryTextColor } = useColors();

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "600", fontSize: 30 }}>{nb ?? "-"}</Text>
      <Text style={{ fontSize: 18, color: secondaryTextColor }}>{label}</Text>
    </View>
  );
}

export default function TripDetailsPage() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { navigate } = useRouter();
  const [trip, setTrip] = useState<Trip>();

  useEffect(() => {
    if (!tripId) return;
    getTripDetails(tripId).then(setTrip);
  }, [tripId]);

  const handleDelete = () => {
    if (!tripId) return;

    if (Platform.OS === "ios") {
      return ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Supprimer le trajet", "Annuler"],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0,
        },
        (btnIndex) => {
          if (btnIndex === 0) {
            deleteTrip(tripId).then(() => navigate("/trips"));
          }
        }
      );
    }

    // If on android, delete directly
    deleteTrip(tripId).then(() => navigate("/trips"));
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 32 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <NbWithLabel nb={trip?.duration} label="min" />
        <NbWithLabel nb={trip?.distance} label="km" />
      </View>
      <Text>{trip && new Date(trip?.date).toDateString()}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
        <Text>{trip?.from}</Text>
        <RepeatTripIcon
          tripsNb={trip?.repeatTrip ?? 1}
          style={{ borderRightWidth: 0 }}
        />
        <Text>{trip?.to}</Text>
      </View>

      <CTA content="Supprimer ce trajet" type="danger" onPress={handleDelete} />
    </View>
  );
}
