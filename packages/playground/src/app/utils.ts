export function withDelay(url: string, milis = 1000) {
  return `https://deelay.me/${milis}/${url}`;
}
