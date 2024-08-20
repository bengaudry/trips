type Weather = "clear" | "clouds" | "rain" | "storm" | "snow";
type RoadType = "ville" | "autoroute" | "campagne" | "voie-rapide";
type Maneuver = "marche-arriere" | "creneau" | "epi" | "bataille" | "demi-tour";

type TripMetadata = {
  weathers: Weather[];
  roadTypes: RoadType[];
  maneuvers: Maneuver[];
  comments: string;
};

type TripWithoutId = {
  from: string;
  to: string;
  uid: string;
  date: Date;
  distance: number;
  duration: number;
  repeatTrip: number;
  metadata?: TripMetadata;
};

type Trip = TripWithoutId & {
  id: string;
};

type FromFirestoreTrip = TripWithoutId & {
  date: { seconds: number; milliseconds: number };
};

type UnknownTrip = Record<keyof TripWithoutId, any>;
