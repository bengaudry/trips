import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth, useColors } from "@/hooks";
import {
  calculateDistanceBetweenCoords,
  fetchCityCoords,
} from "@/api/matrixDistances";
import { addTripToDatabase, editTrip, getTripDetails } from "@/api/trips";
import {
  InputContainer,
  TextInput,
  Title,
  CTA,
  LoadingOverlay,
  Select,
  DateInput,
  MultiSelector,
  BackButton,
  PillSelector,
} from "@/components";

function ProgressElement({
  step,
  index,
  setStep,
}: {
  step: 1 | 2;
  index: 1 | 2;
  setStep: (step: 1 | 2) => void;
}) {
  const { accent, focusedBorder } = useColors();

  return (
    <TouchableOpacity
      style={[
        {
          flexGrow: 1,
          borderRadius: 9999,
          marginVertical: 12,
          backgroundColor: step >= index ? `${accent}70` : focusedBorder,
          height: 6,
        },
      ]}
      onPress={() => setStep(index)}
    />
  );
}

function ProgressBar(props: { step: 1 | 2; setStep: (step: 1 | 2) => void }) {
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <ProgressElement index={1} {...props} />
      <ProgressElement index={2} {...props} />
    </View>
  );
}

function LocationsInputs({
  from,
  onChangeFrom,
  to,
  onChangeTo,
  onBlur,
}: {
  from: string;
  onChangeFrom: (from: string) => void;
  to: string;
  onChangeTo: (to: string) => void;
  onBlur: () => void;
}) {
  const { appBackground, border, accent } = useColors();

  return (
    <View style={[styles.LocationInputsContainer]}>
      <TextInput
        placeholder="Départ"
        value={from}
        onChangeText={onChangeFrom}
        onBlur={onBlur}
        textContentType="location"
        style={{ flexGrow: 1, width: "50%" }}
        inputStyle={[
          styles.LocationInput,
          {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderRightWidth: 0.75,
            borderColor: border,
          },
        ]}
      />
      <Pressable
        style={[
          styles.ReverseLocationsBtn,
          { borderColor: border, backgroundColor: appBackground },
        ]}
        onPress={() => {
          onChangeFrom(to);
          onChangeTo(from);
        }}
      >
        <Ionicons name="repeat-outline" color={accent} size={22} />
      </Pressable>
      <TextInput
        placeholder="Arrivée"
        value={to}
        autoCapitalize={"sentences"}
        onChangeText={onChangeTo}
        onBlur={onBlur}
        textContentType="location"
        style={{ flexGrow: 1, width: "50%" }}
        inputStyle={[
          styles.LocationInput,
          {
            paddingLeft: 24,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            borderLeftWidth: 0.75,
            borderColor: border,
          },
        ]}
      />
    </View>
  );
}

type Page1Data = {
  from: string;
  to: string;
  distance: number | undefined;
  duration: number | undefined;
  repeatTrip: number;
  date: Date;
};

function Page1({
  onChange,
  value,
}: {
  onChange: (data: Page1Data) => void;
  value: Page1Data;
}) {
  const [durationUnit, setDurationUnit] = useState<"h" | "m">("h");

  // useEffect(() => {
  //   onChange({ from, to, distance ?? 0, duration: duration ?? 0, repeatTrip, date });
  // }, [from, to, distance, duration, repeatTrip, date]);

  const autoFillDurationAndLength = async () => {
    const { from, to, distance, duration } = value;
    if (!from || from.length < 3) return;
    if (!to || to.length < 3) return;
    if (from === to) return;
    if (distance && duration) return;

    try {
      const startCoords = await fetchCityCoords(from);
      const endCoords = await fetchCityCoords(to);

      console.log(startCoords, endCoords);

      const res = await calculateDistanceBetweenCoords(startCoords, endCoords);

      console.log(`Distance: ${res.distance.toFixed(2)} km`);
      console.log(`Duration: ${res.duration.toFixed(2)} hours`);
      onChange({ ...value, distance: res.distance, duration: res.duration });
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    if (!value.duration) return;
    if (value.duration >= 60) return setDurationUnit("h");
    setDurationUnit("m");
  }, [value.duration]);

  const handleChangeDuration = (txt: string) => {
    const nb = parseInt(txt);
    const nbVal = isNaN(nb) ? undefined : nb;
    const duration = nbVal
      ? durationUnit === "h"
        ? nbVal * 60
        : nbVal
      : undefined;

    onChange({ ...value, duration });
  };

  useEffect(() => {
    if (value.from.length === 0 && value.to.length === 0) {
      onChange({ ...value, distance: undefined, duration: undefined });
    }
  }, [value.from, value.to]);

  return (
    <>
      <InputContainer>
        <LocationsInputs
          from={value.from}
          to={value.to}
          onChangeFrom={(from) => onChange({ ...value, from })}
          onChangeTo={(to) => onChange({ ...value, to })}
          onBlur={autoFillDurationAndLength}
        />

        <DateInput
          date={value.date}
          onChange={(date) => onChange({ ...value, date })}
        />

        <InputContainer horizontal>
          <TextInput
            label="Longueur"
            keyboardType="number-pad"
            placeholder="15km"
            value={value.distance?.toString()}
            onChangeText={(txt) =>
              onChange({
                ...value,
                distance: isNaN(parseInt(txt)) ? undefined : parseInt(txt),
              })
            }
            style={{ flexGrow: 3 }}
          />
          <TextInput
            label="Durée"
            keyboardType="number-pad"
            placeholder="25min"
            value={
              value.duration
                ? (durationUnit === "h"
                    ? Math.round(value.duration / 60)
                    : value.duration
                  ).toString()
                : undefined
            }
            onChangeText={handleChangeDuration}
            style={{ flexGrow: 3 }}
          />
          <Select
            label=" "
            value={durationUnit}
            items={[
              { label: "h", value: "h" },
              { label: "min", value: "m" },
            ]}
            onChange={setDurationUnit}
          />
        </InputContainer>

        <PillSelector
          label="Type de trajet"
          items={[
            {
              label: "Aller simple",
              value: 1,
              icon: "arrow-forward-outline",
            },
            { label: "Aller retour", value: 2, icon: "code" },
          ]}
          value={value.repeatTrip}
          onChange={(repeatTrip) => onChange({ ...value, repeatTrip })}
        />
      </InputContainer>
    </>
  );
}

type Page2Data = TripMetadata;

function Page2({
  value,
  onChange,
}: {
  value: Page2Data;
  onChange: (data: Page2Data) => void;
}) {
  return (
    <>
      <MultiSelector<Weather>
        label="Météo"
        defaultValues={value.weathers}
        items={[
          {
            label: "Ensoleillé",
            value: "clear",
            icon: "sunny-outline",
          },
          {
            label: "Nuageux",
            value: "clouds",
            icon: "cloudy-outline",
          },
          {
            label: "Pluie",
            value: "rain",
            icon: "rainy-outline",
          },
          {
            label: "Orage",
            value: "storm",
            icon: "thunderstorm-outline",
          },
          {
            label: "Neige",
            value: "snow",
            icon: "snow-outline",
          },
        ]}
        onChange={(weathers) => onChange({ ...value, weathers })}
      />
      <MultiSelector<RoadType>
        label="Types de voies"
        defaultValues={value.roadTypes}
        items={[
          {
            label: "Ville",
            value: "ville",
            icon: "business-outline",
          },
          {
            label: "Autoroute",
            value: "autoroute",
            icon: "car-sport-outline",
          },
          {
            label: "Campagne",
            value: "campagne",
            icon: "car-sport-outline",
          },
          {
            label: "Voie rapide",
            value: "voie-rapide",
            icon: "car-sport-outline",
          },
        ]}
        onChange={(roadTypes) => onChange({ ...value, roadTypes })}
      />
      <MultiSelector<Maneuver>
        label="Manoeuvres réalisées"
        defaultValues={value.maneuvers}
        items={[
          {
            label: "Marche arrière",
            value: "marche-arriere",
            icon: "car-sport-outline",
          },
          {
            label: "Créneau",
            value: "creneau",
            icon: "car-sport-outline",
          },
          {
            label: "Epi",
            value: "epi",
            icon: "car-sport-outline",
          },
          {
            label: "Bataille",
            value: "bataille",
            icon: "car-sport-outline",
          },
          {
            label: "Demi-tour",
            value: "demi-tour",
            icon: "car-sport-outline",
          },
        ]}
        onChange={(maneuvers) => onChange({ ...value, maneuvers })}
      />
      <TextInput
        label="Commentaires"
        multiline
        value={value.comments}
        onChangeText={(comments) => onChange({ ...value, comments })}
        placeholder="Écris-ici les commentaires éventuels que tu souhaite garder après ce trajet"
      />
    </>
  );
}

export default function AddTripPage() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const editTripMode: boolean = tripId !== undefined && tripId !== "null";
  const { user } = useAuth();
  const { navigate } = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [page1Data, setPage1Data] = useState<Page1Data>({
    from: "",
    to: "",
    date: new Date(),
    distance: undefined,
    duration: undefined,
    repeatTrip: 1,
  });
  const [page2Data, setPage2Data] = useState<Page2Data>({
    comments: "",
    maneuvers: [],
    roadTypes: [],
    weathers: [],
  });

  const handleAddTripToDb = async () => {
    try {
      if (!user || !page1Data) return;
      setLoading(true);
      if (editTripMode) {
        // @ts-expect-error
        await editTrip(tripId, { ...page1Data, metadata: page2Data });
      } else {
        await addTripToDatabase({
          uid: user.uid,
          ...page1Data,
          metadata: page2Data,
        });
      }
      navigate("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trip details if user is editing a trip and autofills the inputs
  const fetchTrip = async () => {
    if (editTripMode) {
      try {
        // fetch trip data from database and update page1Data and page2Data
        // @ts-expect-error
        const trip = await getTripDetails(tripId);
        if (!trip) return navigate("/home");
        console.log(trip);
        setPage1Data({
          ...trip,
        });
        if (trip.metadata) setPage2Data(trip.metadata);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  return (
    <SafeAreaView>
      <LoadingOverlay visible={loading} />
      <ScrollView>
        <KeyboardAvoidingView
          behavior="position"
          contentContainerStyle={styles.ScrollViewContent}
        >
          <View>
            <Title heading="screen">
              {editTripMode ? "Modifier" : "Ajouter"} un trajet
            </Title>
            {step === 1 ? (
              <Page1 value={page1Data} onChange={setPage1Data} />
            ) : (
              <>
                <BackButton onPress={() => setStep(1)} />
                <Page2 value={page2Data} onChange={setPage2Data} />
              </>
            )}
          </View>

          <View
            style={{
              marginTop: 32,
            }}
          >
            <CTA
              content={
                step === 1 ? "Suivant" : editTripMode ? "Modifier" : "Ajouter"
              }
              disabled={!page1Data}
              loading={loading}
              onPress={() => {
                if (step === 1) return setStep(2);
                handleAddTripToDb();
              }}
            />
            <ProgressBar step={step} setStep={setStep} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ScrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  LocationInputsContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  LocationInput: {
    borderRadius: 0,
    textTransform: "capitalize",
    borderWidth: 1.5,
  },
  RoundTripIcon: {
    flexGrow: 1,
    marginHorizontal: "auto",
    width: "100%",
  },
  ReverseLocationsBtn: {
    position: "absolute",
    zIndex: 50,
    borderRadius: 9999,
    padding: 3,
    aspectRatio: "1/1",
    borderWidth: 1,
  },
});
