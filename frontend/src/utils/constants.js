/**
 * Constants & Regional Configurations for DRISHTI-NER
 */

export const NER_STATES = [
  "All States",
  "Assam",
  "Arunachal Pradesh",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura"
];

export const MAP_CENTERS = {
  "All States": { lat: 25.8, lng: 92.8, zoom: 7 },
  "Assam": { lat: 26.2006, lng: 92.9376, zoom: 8 },
  "Arunachal Pradesh": { lat: 27.5, lng: 93.6, zoom: 8 },
  "Meghalaya": { lat: 25.4670, lng: 91.3662, zoom: 9 },
  "Manipur": { lat: 24.6637, lng: 93.9063, zoom: 9 },
  "Mizoram": { lat: 23.1645, lng: 92.9376, zoom: 9 },
  "Nagaland": { lat: 26.1584, lng: 94.5624, zoom: 9 },
  "Sikkim": { lat: 27.5330, lng: 88.5122, zoom: 9 },
  "Tripura": { lat: 23.9408, lng: 91.9882, zoom: 9 }
};

export const RISK_COLOR_MAP = {
  LOW: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    hex: "#10B981",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  },
  MODERATE: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    hex: "#F59E0B",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  HIGH: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    hex: "#F97316",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40"
  },
  CRITICAL: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    hex: "#EF4444",
    badge: "bg-red-500/20 text-red-300 border-red-500/40"
  }
};

export const TILE_PROVIDERS = {
  dark: {
    name: "Dark Carto",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
  },
  topo: {
    name: "OpenTopo Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap"
  },
  osm: {
    name: "Standard OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors"
  }
};
