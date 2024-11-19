export function getOrCreateUID(): string {
  let uid = localStorage.getItem("userUID");
  if (!uid) {
    uid = crypto.randomUUID(); // Generate a UUID
    localStorage.setItem("userUID", uid);
  }
  return uid;
}
