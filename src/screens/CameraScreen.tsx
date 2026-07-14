import { useQuery } from "@tanstack/react-query";
import { useIsFocused } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { fetchPokemon } from "../api/pokemon";
import CameraWithFaceDetection from "../components/CameraScreen/CameraWithFaceDetection";
import Loader from "../components/Loader";
import NoFavouritePokemon from "../components/PokemonScreen/NoFavourtiePokemon";
import { useFavouritePokemonName } from "../storage/favouritePokemon";

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const device = useCameraDevice("front");
  const { favouritePokemonName, isLoading: isLoadingFavourite } =
    useFavouritePokemonName();
  const {
    data: pokemon,
    isLoading: isLoadingPokemon,
    isError: isErrorPokemon,
  } = useQuery({
    queryKey: ["pokemon", favouritePokemonName],
    queryFn: () => fetchPokemon(favouritePokemonName),
    enabled: !!favouritePokemonName,
  });

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No camera permission found</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No camera device found</Text>
      </View>
    );
  }

  if (isLoadingFavourite) {
    return <Loader />;
  }

  if (!favouritePokemonName || isErrorPokemon) {
    return <NoFavouritePokemon />;
  }
  if (
    isLoadingPokemon ||
    isErrorPokemon ||
    !pokemon ||
    !pokemon.sprites ||
    !pokemon.sprites.front_default
  ) {
    return <Loader />;
  }
  return (
    <CameraWithFaceDetection
      device={device}
      isFocused={isFocused}
      pokemon={{ name: pokemon.name, url: pokemon.sprites.front_default }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});
