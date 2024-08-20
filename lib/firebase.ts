export function prettifyFirebaseErrors(err: string) {
  const [type, msg]: [string, string] = err
    .replace("Firebase: Error (", "")
    .replace(")", "")
    .replaceAll("-", " ")
    .split("/");

  return `${msg.charAt(0).toUpperCase() + msg.slice(1)}`;
}
