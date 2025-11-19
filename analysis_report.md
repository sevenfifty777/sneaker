# Analysis Report: Sneaker Tool & Normandy Map

## 1. Codebase Overview
The workspace contains a full-stack application for monitoring DCS missions using Tacview.
- **Backend (`server/`)**: A Go server that connects to Tacview (`tacview_client.go`), processes real-time object data (`state.go`), and serves it via HTTP.
- **Frontend (`src/`)**: A React application that visualizes the mission on a map (`components/Map.tsx`). It detects the active map based on the session's reference coordinates.
- **Map Data**: Map definitions are in `src/dcs/maps/`. Airfield data is stored in JSON files in `src/data/airbases/`.

## 2. Normandy Map Issue
The user reported issues with the Normandy map since the last terrain update.
My analysis of the `Normandy/` folder and the code reveals the following:

### A. Map Version Update
- The `Normandy/entry.lua` file confirms that the installed map is **Normandy 2.0** (`['localizedName'] = "Normandy 2.0"`).
- The new map is significantly larger (410x510 km) and includes new areas like London and Paris.
- `Normandy/Radio.lua` lists **90 airfields**, whereas the current tool's data file (`src/data/airbases/normandy.json`) only contains **70 airfields**. This confirms the tool's data is outdated.

### B. Map Detection Failure
- The frontend detects the map by checking if the session's `ReferenceLatitude` and `ReferenceLongitude` fall within a specific bounding box.
- **Current Logic (`src/App.tsx`)**:
  ```typescript
  else if (refLat >= 48 && refLat <= 52 && refLng >= -4 && refLng <= 4) {
    dcsMap = Normandy;
  }
  ```
- **Problem**: The reference point for Normandy 2.0 might have shifted or falls outside this hardcoded 4x8 degree box. If the reference point is outside, the map is not loaded.

### C. Missing Airfields
- The tool uses `src/data/airbases/normandy.json` to display airfields.
- Since this file is missing the 20 new airfields from Normandy 2.0, they will not appear on the map even if the map loads.
- The new airfield data is likely contained in the binary `.rn4` files in `Normandy/AirfieldsTaxiways/`, which cannot be easily parsed to extract coordinates.

## 3. Proposed Fixes
1.  **Widen Map Detection Bounds**: I will update `src/App.tsx` to use a larger bounding box for Normandy. This should allow the tool to detect the map even if the reference point has moved slightly or if the map covers a larger area.
2.  **Airfield Data**: Updating the airfield JSON requires the coordinates of the new airfields. Since these are not available in plain text in the `Normandy/` folder, I cannot automatically update `normandy.json`. However, fixing the map detection should at least restore the map background and existing airfields.

## 4. Next Steps
I will apply the fix to `src/App.tsx` to widen the detection coordinates.
