import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { ExpoRouter } from "expo-router/types/expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
//import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import { getCurrentUserTrips } from "@/api/trips";
import { AddTripButtons, CTA, Text, Title, TripDisplayer } from "@/components";
import { useAuth, useColors } from "@/hooks";

const Header = ({
  user,
  navigate,
}: {
  user: User | null;
  navigate: (href: ExpoRouter.Href) => void;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <View>
      <Title heading="screen" style={{ marginBottom: 0 }}>
        Bonjour {user?.displayName}
      </Title>
      <Title heading="subtitle">On se rapproche du permis !</Title>
    </View>
    <TouchableOpacity
      onPress={() => navigate("/profile")}
      style={{
        backgroundColor: "#e6e6e6",
        borderRadius: 9999,
        width: 50,
        aspectRatio: "1/1",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user?.displayName ? (
        <Text style={{ fontSize: 22, fontWeight: "600" }}>
          {user.displayName[0]}
        </Text>
      ) : (
        <Ionicons name="person-outline" size={22} />
      )}
    </TouchableOpacity>
  </View>
);

const StatPill = ({
  icon,
  label,
  value,
}: {
  icon: string;
  value?: string | number;
  label: string;
}) => {
  const { secondaryTextColor, accent, invertedPrimaryTextColor } = useColors();

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <View
        style={{
          backgroundColor: accent,
          padding: 8,
          borderRadius: 8,
          shadowColor: accent,
          shadowOpacity: 0.4,
          shadowOffset: { height: 4, width: 0 },
          shadowRadius: 8,
        }}
      >
        {/* @ts-ignore */}
        <AntDesign name={icon} size={22} color={invertedPrimaryTextColor} />
      </View>
      <Text style={{ fontSize: 16, color: secondaryTextColor }}>
        <Text style={{ fontWeight: "700", fontSize: 28 }}>{value ?? "-"}</Text>{" "}
        {label}
      </Text>
    </View>
  );
};

const Stats = ({
  trips,
  totalDistance,
  totalDuration,
}: {
  trips: Trip[] | null;
  totalDistance: number;
  totalDuration: { duration: number; unit: string };
}) => {
  const { subtleBackground, shadow, border } = useColors();

  return (
    <View
      style={{
        backgroundColor: subtleBackground,
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        flexDirection: "row",
        gap: 16,
        shadowColor: shadow,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { height: 4, width: 0 },
      }}
    >
      <View style={{ width: "50%", gap: 20 }}>
        <StatPill icon="barschart" label="trajets" value={trips?.length} />
        <StatPill
          icon="car"
          label="KM"
          value={trips ? totalDistance : undefined}
        />
      </View>

      <View
        style={{
          width: 1.5,
          height: "100%",
          backgroundColor: border,
          marginLeft: -8,
        }}
      />

      <View style={{ width: "50%", gap: 20 }}>
        <StatPill
          icon="dashboard"
          label="%"
          value={trips ? Math.round((totalDistance / 3000) * 100) : undefined}
        />
        <StatPill
          icon="hourglass"
          label={totalDuration.unit}
          value={trips ? totalDuration.duration : undefined}
        />
      </View>
    </View>
  );
};

const Progression = ({
  trips,
  totalDistance,
}: {
  trips: Trip[] | null;
  totalDistance: number;
}) => {
  const { subtleBackground, shadow, accent, secondaryTextColor } = useColors();
  const calculatePercent = () => Math.round((totalDistance * 100) / 3000);

  return (
    <View
      style={{
        backgroundColor: subtleBackground,
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        gap: 16,
        shadowColor: shadow,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { height: 4, width: 0 },
      }}
    >
      <Title>Progression</Title>
      <Text>Vous avez conduit {trips ? totalDistance : "-"} km / 3000 km</Text>
      <View
        style={{
          width: "100%",
          height: 6,
          backgroundColor: `${accent}20`,
          borderRadius: 999,
          marginBottom: 15,
        }}
      >
        <View
          style={{
            width: `${calculatePercent()}%`,
            height: "100%",
            backgroundColor: accent,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              position: "absolute",
              width: 50,
              top: 6,
              right: calculatePercent() > 10 ? 0 : "auto",
              left: calculatePercent() > 10 ? "auto" : 0,
              textAlign: calculatePercent() > 10 ? "right" : "left",
            }}
          >
            {calculatePercent()}%
          </Text>
        </View>
      </View>
    </View>
  );
};

function RecentTrips({ trips }: { trips: Trip[] | null }) {
  const { accent } = useColors();

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 32,
          marginBottom: 16,
        }}
      >
        <Title>Trajets récents</Title>
        <Link
          href="/trips"
          style={{
            color: accent,
            fontSize: 16,
            fontWeight: "500",
            textDecorationLine: "underline",
          }}
        >
          Voir tout
        </Link>
      </View>

      {trips && trips.length > 0 ? (
        <View style={{ gap: 8 }}>
          {trips.slice(0, 4).map((trip, key) => (
            <TripDisplayer {...trip} key={key} />
          ))}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { navigate } = useRouter();

  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [loading, setLoading] = useState(false);

  const getTotalTripsDistance = () => {
    if (!trips) return 0;

    let totalDistance = 0;
    trips?.forEach((trip) => {
      totalDistance += trip.distance * trip.repeatTrip;
    });
    return totalDistance;
  };

  const getTotalTripsDuration = () => {
    if (!trips) return { duration: 0, unit: "min" };

    let totalDuration = 0;
    trips?.forEach((trip) => {
      totalDuration += trip.duration * trip.repeatTrip;
    });
    return totalDuration > 60
      ? { duration: Math.round(totalDuration / 60), unit: "h" }
      : { duration: totalDuration, unit: "min" };
  };

  const fetchTrips = () => {
    setLoading(true);
    getCurrentUserTrips()
      .then((t) => {
        setTrips(t);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchTrips, []);

  return (
    <SafeAreaView>
      <ScrollView
        style={{ height: "100%" }}
        contentContainerStyle={styles.scrollContainer}
      >
        <RefreshControl refreshing={loading} onRefresh={fetchTrips} />
        <Header navigate={navigate} user={user} />

        {/* {!__DEV__ && <BannerAd
          size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
          unitId="ca-app-pub-9717273868571983/1718356174ù"
        />} */}

        <Progression trips={trips} totalDistance={getTotalTripsDistance()} />

        <Stats
          trips={trips}
          totalDistance={getTotalTripsDistance()}
          totalDuration={getTotalTripsDuration()}
        />
        <CTA
          content={__DEV__ ? "Suivre mon trajet" : "Ajouter un trajet"}
          onPress={() => navigate(__DEV__ ? "/autoadd" : "/addtrip/null")}
        />
        <RecentTrips trips={trips ? trips.slice(0, 5) : null} />
      </ScrollView>
      <AddTripButtons />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
});
