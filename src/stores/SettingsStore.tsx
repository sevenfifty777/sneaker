import create from "zustand";

export enum GroundUnitMode {
  FRIENDLY = "friendly",
  ENEMY = "enemy",
}

export type MapProvider =
  | "cartodb-dark"
  | "cartodb-light"
  | "cartodb-voyager"
  | "osm"
  | "satellite"
  | "esri-street"
  | "esri-topo";

export type SettingsStoreData = {
  map: {
    showTrackIcons?: boolean;
    showTrackLabels?: boolean;
    trackTrailLength?: number;
    groundUnitMode?: GroundUnitMode;
    mapProvider?: MapProvider;
  };
};

export const settingsStore = create<SettingsStoreData>(() => {
  const localData = localStorage.getItem("settings");
  if (localData) {
    return JSON.parse(localData) as SettingsStoreData;
  }
  return {
    map: {
      showTrackIcons: true,
      showTrackLabels: true,
      trackTrailLength: 9,
      groundUnitMode: GroundUnitMode.ENEMY,
      mapProvider: "osm",
    },
  };
});

settingsStore.subscribe((state) => {
  localStorage.setItem("settings", JSON.stringify(state));
});
