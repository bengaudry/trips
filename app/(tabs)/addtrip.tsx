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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth, useColors } from "@/hooks";
import {
  calculateDistanceBetweenCoords,
  fetchCityCoords,
} from "@/api/matrixDistances";
import { addTripToDatabase } from "@/api/trips";
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
  distance: number;
  duration: number;
  repeatTrip: number;
  date: Date;
};

function Page1({ onChange }: { onChange: (data?: Page1Data) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [distance, setDistance] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [repeatTrip, setRepeatTrip] = useState(1);
  const [date, setDate] = useState<Date>(new Date());

  const [durationUnit, setDurationUnit] = useState<"h" | "m">("h");

  useEffect(() => {
    if (!distance || distance <= 0 || !duration || duration <= 0)
      return onChange(undefined);
    onChange({ from, to, distance, duration, repeatTrip, date });
  }, [from, to, distance, duration, repeatTrip, date]);

  const autoFillDurationAndLength = async () => {
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
      setDistance(res.distance);
      setDuration(res.duration);
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    if (!duration) return;
    if (duration >= 60) return setDurationUnit("h");
    setDurationUnit("m");
  }, [duration]);

  const handleChangeDuration = (txt: string) => {
    const nb = parseInt(txt);
    const value = isNaN(nb) ? undefined : nb;
    const convertedValue = value
      ? durationUnit === "h"
        ? value * 60
        : value
      : undefined;

    setDuration(convertedValue);
  };

  useEffect(() => {
    if (from.length === 0 && to.length === 0) {
      setDuration(undefined);
      setDistance(undefined);
    }
  }, [from, to]);
  return (
    <>
      <InputContainer>
        <LocationsInputs
          from={from}
          to={to}
          onChangeFrom={setFrom}
          onChangeTo={setTo}
          onBlur={autoFillDurationAndLength}
        />

        <DateInput date={date} onChange={setDate} />

        <InputContainer horizontal>
          <TextInput
            label="Longueur"
            keyboardType="number-pad"
            placeholder="15km"
            value={distance?.toString()}
            onChangeText={(txt) =>
              setDistance(isNaN(parseInt(txt)) ? undefined : parseInt(txt))
            }
            style={{ flexGrow: 3 }}
          />
          <TextInput
            label="Durée"
            keyboardType="number-pad"
            placeholder="25min"
            value={
              duration
                ? (durationUnit === "h"
                    ? Math.round(duration / 60)
                    : duration
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
          value={repeatTrip}
          onChange={setRepeatTrip}
        />
      </InputContainer>
    </>
  );
}

type Page2Data = TripMetadata;

function Page2({ onChange }: { onChange: (data?: Page2Data) => void }) {
  const [weathers, setWeathers] = useState<Weather[]>([]);
  const [roadTypes, setRoadTypes] = useState<RoadType[]>([]);
  const [maneuvers, setManeuvers] = useState<Maneuver[]>([]);
  const [comments, setComments] = useState("");

  useEffect(() => {
    onChange({ weathers, roadTypes, maneuvers, comments });
  }, [weathers, roadTypes, maneuvers, comments]);

  return (
    <>
      <MultiSelector<Weather>
        label="Météo"
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
        onChange={setWeathers}
      />
      <MultiSelector<RoadType>
        label="Types de voies"
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
        onChange={setRoadTypes}
      />
      <MultiSelector<Maneuver>
        label="Manoeuvres réalisées"
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
        onChange={setManeuvers}
      />
      <TextInput
        label="Commentaires"
        multiline
        value={comments}
        onChangeText={setComments}
        placeholder="Écris-ici les commentaires éventuels que tu souhaite garder après ce trajet"
      />
    </>
  );
}

export default function AddTripPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [page1Data, setPage1Data] = useState<Page1Data>();
  const [page2Data, setPage2Data] = useState<Page2Data>();

  const handleAddTripToDb = async () => {
    try {
      if (!user || !page1Data) return;
      setLoading(true);
      await addTripToDatabase({
        uid: user.uid,
        ...page1Data,
        metadata: page2Data,
      });
      navigate("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <LoadingOverlay visible={loading} />
      <ScrollView>
        <KeyboardAvoidingView
          behavior="position"
          contentContainerStyle={styles.ScrollViewContent}
        >
          <View>
            <Title heading="screen">Ajouter un trajet</Title>
            {step === 1 ? (
              <Page1 onChange={setPage1Data} />
            ) : (
              <>
                <BackButton onPress={() => setStep(1)} />
                <Page2 onChange={setPage2Data} />
              </>
            )}
          </View>

          <View>
            <CTA
              content={step === 1 ? "Suivant" : "Ajouter"}
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
