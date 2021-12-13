export function getHeaderId(location: string): string {
  return location.split('?id=eq.')[1];
}
