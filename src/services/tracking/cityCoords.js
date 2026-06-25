/** Centres approximatifs pour simulation GPS / ETA (pas de géocodage réel). */
export const CITY_COORDS = {
  Paris: { lat: 48.8566, lng: 2.3522 },
  Lyon: { lat: 45.764, lng: 4.8357 },
  Lille: { lat: 50.6292, lng: 3.0573 },
  Marseille: { lat: 43.2965, lng: 5.3698 },
  Nice: { lat: 43.7102, lng: 7.262 },
  Nantes: { lat: 47.2184, lng: -1.5536 },
  Bordeaux: { lat: 44.8378, lng: -0.5792 },
  default: { lat: 46.5, lng: 2.5 },
};

export function coordsForCity(cityName) {
  if (!cityName) return CITY_COORDS.default;
  const key = Object.keys(CITY_COORDS).find((k) => k.toLowerCase() === String(cityName).trim().toLowerCase());
  return key ? CITY_COORDS[key] : CITY_COORDS.default;
}
