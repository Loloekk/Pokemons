import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import {
  ActivityIndicatorProps,
  ImageStyle,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { fetchPokemon } from "../api/pokemon";
import Loader from "./Loader";

type PokemonImageProps = {
  pokemonName: string;
  style?: ImageStyle;
  loaderStyle?: ViewStyle;
  loaderSize?: ActivityIndicatorProps["size"];
};

export default function PokemonImage({
  pokemonName,
  style,
  loaderStyle,
  loaderSize = "small",
}: PokemonImageProps) {
  const {
    data: pokemon,
    isLoading: isLoadingPokemon,
    isError: isErrorPokemon,
  } = useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: () => fetchPokemon(pokemonName),
    enabled: !!pokemonName,
  });

  const imageStyle = [styles.image, style];

  if (isLoadingPokemon || isErrorPokemon || !pokemon) {
    return (
      <Loader
        size={loaderSize}
        style={[styles.image, style, { paddingVertical: 0 }, loaderStyle]}
      />
    );
  }

  return (
    <Image
      source={{ uri: pokemon.sprites.front_default ?? "" }}
      style={imageStyle}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
  },
});
