export function getHeaderId(location) {
  try {
    return location.split("?id=eq.")[1];
  } catch {
    return null;
  }
}
