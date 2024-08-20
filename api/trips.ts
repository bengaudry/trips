import { getFirebaseAuth, getFirebaseDb } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  Timestamp,
  where,
  deleteDoc,
} from "firebase/firestore";

export function isTripCorrect(trip: any) {
  if (!trip.duration || typeof trip.duration !== "number" || trip.duration <= 0)
    return null;
  if (!trip.distance || typeof trip.distance !== "number" || trip.distance <= 0)
    return null;
  if (!trip.from || typeof trip.from !== "string" || trip.from.length < 3)
    return null;
  if (!trip.to || typeof trip.to !== "string" || trip.to.length < 3)
    return null;
  if (
    !trip.repeatTrip ||
    typeof trip.repeatTrip !== "number" ||
    trip.repeatTrip < 1
  )
    return null;
  return trip as TripWithoutId;
}

export function isFirebaseTripCorrect(trip: any) {
  if (!isTripCorrect) return null;
  if (!trip.date || !("seconds" in trip.date)) return null;
  return trip as FromFirestoreTrip;
}

export async function addTripToDatabase(trip: any | TripWithoutId) {
  const correctTrip = isTripCorrect(trip);
  if (!correctTrip) throw new Error("trip-format-not-valid");

  const { date, ...data } = correctTrip;

  const doc = await addDoc(collection(getFirebaseDb(), "trips"), {
    date: Timestamp.fromDate(new Date(date)),
    ...data,
  });
  return doc.id;
}

export async function getCurrentUserTrips(): Promise<Trip[] | null> {
  try {
    const currentUser = getFirebaseAuth().currentUser;
    if (!currentUser) throw new Error("user-not-logged-in");

    const q = query(
      collection(getFirebaseDb(), "trips"),
      where("uid", "==", currentUser.uid),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);

    const trips: Trip[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const tripWithoutId = isFirebaseTripCorrect(data);
      if (!tripWithoutId) return;

      const { date, ...tripData } = tripWithoutId;

      trips.push({
        id: doc.id,
        date: new Date(date.seconds * 1000),
        ...tripData,
      });
    });

    return trips;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getTripDetails(tripId: string) {
  try {
    const docRef = doc(getFirebaseDb(), "trips", tripId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Trip does not exist");

    const data = docSnap.data();
    const tripWithoutId = isFirebaseTripCorrect(data);
    if (!tripWithoutId) return;

    const { date, ...tripData } = tripWithoutId;

    return {
      id: docSnap.id,
      date: new Date(date.seconds * 1000),
      ...tripData,
    } as Trip;
  } catch (err) {}
}

export async function deleteTrip(tripId: string) {
  try {
    const docRef = doc(getFirebaseDb(), "trips", tripId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(err);
  }
}
