import React, { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LiveTrackingMapProps {
  pickup: LatLng;
  dropoff: LatLng;
  /** Latest known rider position; updates the rider marker + rider→pickup line. */
  rider?: LatLng | null;
  /** Which leg to emphasise. "to_pickup" before pickup, "to_dropoff" after. */
  phase?: "to_pickup" | "to_dropoff";
  height?: number;
}

const isValid = (p?: LatLng | null): p is LatLng =>
  !!p &&
  typeof p.lat === "number" &&
  typeof p.lng === "number" &&
  !(p.lat === 0 && p.lng === 0);

/**
 * Leaflet/OpenStreetMap map rendered inside a WebView (no native map module,
 * no API key — works in Expo Go and dev builds). Shows pickup, drop-off, and
 * the live rider marker, with rider→pickup and pickup→drop-off route lines.
 */
export const LiveTrackingMap = ({
  pickup,
  dropoff,
  rider,
  phase = "to_pickup",
  height = 240,
}: LiveTrackingMapProps) => {
  const webRef = useRef<WebView>(null);

  // Build the HTML once from the fixed pickup/drop-off. Rider updates are
  // pushed imperatively via injectJavaScript so the map never reloads.
  const html = useMemo(
    () => buildHtml(pickup, dropoff, isValid(rider) ? rider : null, phase),
    // Intentionally only depends on the endpoints — rider moves are injected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng]
  );

  // Push rider position changes into the existing map.
  React.useEffect(() => {
    if (!isValid(rider)) return;
    webRef.current?.injectJavaScript(
      `window.updateRider && window.updateRider(${rider.lat}, ${rider.lng}, "${phase}"); true;`
    );
  }, [rider?.lat, rider?.lng, phase, rider]);

  if (!isValid(pickup) || !isValid(dropoff)) {
    return null;
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.web}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        // Avoids a white flash before Leaflet paints
        androidLayerType="hardware"
      />
    </View>
  );
};

function buildHtml(
  pickup: LatLng,
  dropoff: LatLng,
  rider: LatLng | null,
  phase: "to_pickup" | "to_dropoff"
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #e8eef0; }
    .leaflet-control-attribution { font-size: 8px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var PICKUP = [${pickup.lat}, ${pickup.lng}];
    var DROPOFF = [${dropoff.lat}, ${dropoff.lng}];

    var map = L.map('map', { zoomControl: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    function dot(color) {
      return L.divIcon({
        className: '',
        html: '<div style="background:' + color + ';width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.4)"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
    }

    L.marker(PICKUP, { icon: dot('#f59e0b') }).addTo(map).bindPopup('Pickup');
    L.marker(DROPOFF, { icon: dot('#ef4444') }).addTo(map).bindPopup('Drop-off');
    L.polyline([PICKUP, DROPOFF], { color: '#01656c', weight: 4, opacity: 0.85 }).addTo(map);

    var riderMarker = null, riderLine = null;

    function fit() {
      var pts = [PICKUP, DROPOFF];
      if (riderMarker) pts.push(riderMarker.getLatLng());
      map.fitBounds(L.latLngBounds(pts).pad(0.25));
    }

    window.updateRider = function (lat, lng, phase) {
      var ll = [lat, lng];
      if (!riderMarker) {
        riderMarker = L.marker(ll, { icon: dot('#10b981') }).addTo(map).bindPopup('Rider');
      } else {
        riderMarker.setLatLng(ll);
      }
      var target = phase === 'to_dropoff' ? DROPOFF : PICKUP;
      if (!riderLine) {
        riderLine = L.polyline([ll, target], { color: '#10b981', weight: 3, dashArray: '6,8', opacity: 0.95 }).addTo(map);
      } else {
        riderLine.setLatLngs([ll, target]);
      }
      fit();
    };

    ${rider ? `window.updateRider(${rider.lat}, ${rider.lng}, "${phase}");` : ""}
    fit();
    true;
  </script>
</body>
</html>`;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#e8eef0",
  },
  web: { flex: 1, backgroundColor: "transparent" },
});
