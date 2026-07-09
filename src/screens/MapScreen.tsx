import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PokemonMarker } from "../types/pokemon";
export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Record<string, PokemonMarker>>({});

  useEffect(() => {
    async function getCurrentLocation() {
      if (Platform.OS === "android") {
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    }

    getCurrentLocation();
  }, []);

  if (Platform.OS === "android") {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Buy Iphone.</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Getting your location...</Text>
      </View>
    );
  }

  const { latitude, longitude } = location.coords;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation
        onLongPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;
          console.log("Long press coordinates:", { latitude, longitude });
          const name = "New Pokemon Marker";
          setMarkers((prev) => ({
            ...prev,
            [name]: { latitude, longitude, name },
          }));
        }}
      >
        {Object.values(markers).map((marker) => (
          <Marker
            key={marker.name}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  message: { fontSize: 18, textAlign: "center" },
});
