import { useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

import { getCurrentUserTrips } from "@/api/trips";
import { AddTripButtons, TripsList } from "@/components";

export default function TripsListPage() {
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [loading, setLoading] = useState(false);

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
        <TripsList trips={trips} />
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
