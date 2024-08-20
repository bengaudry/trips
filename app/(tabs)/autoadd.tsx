import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "@/components";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LoadingOverlay, CTA } from "@/components";
import { fetchLocationFromCoords } from "@/api/matrixDistances";
import { addTripToDatabase } from "@/api/trips";
import { useAuth, useColors } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MapView, { MapMarker } from "react-native-maps";
import { BlurView } from "expo-blur";

type Coords = {
  latitude: number;
  longitude: number;
};

function addZeroBeforeNumber(nb: number) {
  return nb < 10 ? `0${nb}` : nb;
}

export default function AutoTripPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { accent, invertedPrimaryTextColor } = useColors();

  const [loading, setLoading] = useState(false);

  const [currentCoords, setCurrentCoords] = useState<Coords>();

  const [startCoords, setStartCoords] = useState<Coords>();
  const [startLocation, setStartLocation] = useState<string>();

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const [duration, setDuration] = useState(0);

  const [paused, setPaused] = useState(false);

  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    console.info("Fetching user location to show on map");
    setLoading(true);
    requestAccessToLocation().then(async () => {
      let position = await Location.getCurrentPositionAsync({});
      setCurrentCoords({
        ...position.coords,
      });
      setLoading(false);
    });
  }, []);

  useEffect(() => {}, []);

  const requestAccessToLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }
  };

  const handleStartTrip = async () => {
    try {
      setLoading(true);

      requestAccessToLocation();

      let position = await Location.getCurrentPositionAsync({});
      setStartCoords({ ...position.coords });
      setCurrentCoords({ ...position.coords });

      const location = await fetchLocationFromCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });

      Location.watchPositionAsync(
        {
          accuracy: Location.LocationAccuracy.BestForNavigation,
          timeInterval: 500,
        },
        (location) => {
          console.log(location.coords);
          const currSpeed = location.coords.speed;
          setSpeed(currSpeed && currSpeed > 0 ? currSpeed : 0);
          setCurrentCoords({
            ...position.coords,
          });
        }
      );

      setStartLocation(location);
      startTimer();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    const id = setTimeout(() => {
      setDuration((d) => d + 1);
      startTimer();
    }, 1000);
    setIntervalId(id);
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours}:${addZeroBeforeNumber(minutes)}:${addZeroBeforeNumber(
      seconds
    )}`;
  };

  const handleEndTrip = async () => {
    try {
      if (!startCoords) return;
      setLoading(true);

      let finalPosition = await Location.getCurrentPositionAsync({});

      const endLocation = await fetchLocationFromCoords({
        lat: finalPosition.coords.latitude,
        lon: finalPosition.coords.longitude,
      });
      clearInterval(intervalId);

      // const {distance} = await calculateDistanceBetweenCoords(
      //   [startCoords.latitude, startCoords.longitude],
      //   [finalPosition.coords.latitude, finalPosition.coords.longitude]
      // );

      await addTripToDatabase({
        from: startLocation,
        to: endLocation,
        uid: user?.uid,
        date: Date.now(),
        distance: 1,
        duration: Math.round(duration / 60),
        repeatTrip: 1,
      });
      navigate("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePause = () => {
    setPaused((isPaused) => {
      if (isPaused) {
        startTimer();
        return false;
      }

      clearInterval(intervalId);
      return true;
    });
  };

  return (
    <>
      <LoadingOverlay visible={false} />
      <View style={styles.ScrollViewContent}>
        <MapView
          style={{ width: "100%", height: "100%" }}
          showsUserLocation
          followsUserLocation
          onUserLocationChange={({ nativeEvent }) => {
            const currentSpeed = nativeEvent.coordinate?.speed ?? 0;
            setSpeed(currentSpeed > 0 ? currentSpeed : 0);

            if (
              nativeEvent.coordinate?.latitude &&
              nativeEvent.coordinate.longitude
            )
              setCurrentCoords({ ...nativeEvent.coordinate });
          }}
          toolbarEnabled
          initialRegion={
            currentCoords
              ? {
                  ...currentCoords,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                }
              : undefined
          }
        >
          {startCoords && <MapMarker image={0} coordinate={startCoords} />}
        </MapView>

        <BlurView
          style={{
            width: "100%",
            paddingHorizontal: 16,
            position: "absolute",
            bottom: 0,
            paddingBottom: 32,
            paddingTop: 16,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          intensity={60}
          tint="light"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              marginBottom: 32,
            }}
          >
            <View style={{ width: "50%", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "600",
                }}
              >
                {Math.round(speed)}
              </Text>
              <Text>km/h</Text>
            </View>

            <View style={{ width: "50%", alignItems: "center" }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  0 km
                </Text>
                <Text>Distance</Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {formatDuration(duration)}
                </Text>
                <Text>Time</Text>
              </View>
            </View>
          </View>
          {startCoords ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CTA
                style={{ width: "49%", flexGrow: 1 }}
                secondary
                Before={() => (
                  <Ionicons
                    name={paused ? "play" : "pause"}
                    size={24}
                    color={accent}
                  />
                )}
                content={paused ? "Reprendre" : "Pause"}
                onPress={togglePause}
              />
              <CTA
                style={{ width: "49%", flexGrow: 1 }}
                content="Terminer"
                Before={() => (
                  <Ionicons
                    name={"stop"}
                    size={24}
                    color={invertedPrimaryTextColor}
                  />
                )}
                type="danger"
                onPress={handleEndTrip}
                loading={loading}
              />
            </View>
          ) : (
            <CTA
              content="Démarrer le trajet"
              onPress={handleStartTrip}
              loading={loading}
            />
          )}
        </BlurView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  ScrollViewContent: {
    flexGrow: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
