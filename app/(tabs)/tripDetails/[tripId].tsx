import { useEffect, useState } from "react";
import { ActionSheetIOS, Platform, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { deleteTrip, getTripDetails } from "@/api/trips";
import { CTA, RepeatTripIcon, Text } from "@/components";
import { useColors } from "@/hooks";
import MapView, { LatLng, Marker } from "react-native-maps";
import { fetchCityCoords } from "@/api/matrixDistances";
import { Ionicons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";

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
  const [coords, setCoords] = useState<[LatLng, LatLng]>();

  useEffect(() => {
    if (!tripId) return;
    getTripDetails(tripId).then((value) => {
      if (!value) return;
      setTrip(value);
      fetchCityCoords(value.from).then((fromCoords) => {
        fetchCityCoords(value.to).then((toCoords) => {
          setCoords([fromCoords, toCoords]);
        });
      });
    });
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

  const getInitialMapRegion = () => {
    if (!coords) return undefined;

    const marginPercent = 30 / 100;

    const latDelta = Math.abs(coords[0].latitude - coords[1].latitude);
    const longDelta = Math.abs(coords[0].longitude - coords[1].longitude);

    return {
      latitude: (coords[0].latitude + coords[1].latitude) / 2,
      longitude: (coords[0].longitude + coords[1].longitude) / 2,
      latitudeDelta: latDelta + marginPercent * latDelta,
      longitudeDelta: longDelta + marginPercent * longDelta,
    };
  };

  const writeDateInFrench = () => {
    if (!trip) return;
    const date = new Date(trip.date);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View
      style={{
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <View>
        {__DEV__ && coords && (
          <MapView
            style={{ height: "50%", width: "100%" }}
            initialRegion={getInitialMapRegion()}
          >
            {coords?.map((ll, i) => (
              <Marker coordinate={ll} key={i} />
            ))}

            {coords && (
              <MapViewDirections
                origin={coords[0]}
                destination={coords[1]}
                apikey={"AIzaSyAoIZreuwvHns1a_hKRQuMnFj3lPUJIl40"}
                strokeColor="red"
                strokeWidth={6}
              />
            )}
          </MapView>
        )}

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
          <Text>
            <Ionicons name="calendar-outline" size={22} />
            {writeDateInFrench()}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Text>{trip?.from}</Text>
            <RepeatTripIcon
              tripsNb={trip?.repeatTrip ?? 1}
              style={{ borderRightWidth: 0 }}
            />
            <Text>{trip?.to}</Text>
          </View>
        </View>
      </View>

      <View style={{ gap: 8, paddingHorizontal: 16, paddingBottom: 32 }}>
        <CTA
          secondary
          content="Modifier ce trajet"
          onPress={() => navigate(`/addtrip/${tripId}`)}
        />
        <CTA
          content="Supprimer ce trajet"
          type="danger"
          onPress={handleDelete}
        />
      </View>
    </View>
  );
}
