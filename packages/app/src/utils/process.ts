export function getHeaderId(location: string): string {
  try {
    return location.split("?id=eq.")[1];
  } catch {
    return null;
  }
}
