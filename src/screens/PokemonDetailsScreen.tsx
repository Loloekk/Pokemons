import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import Loader from "../components/Loader";
import PokemonCard from "../components/PokemonCard";
import PokemonFetchFailed from "../components/PokemonFetchFailed";
import { FAVOURITE_KEY } from "../constants/storage";
import { PokemonStats } from "../types/pokemon";

type PokemonDetailsScreenProps = {
  pokemonName: string;
};

export default function PokemonDetailsScreen({
  pokemonName,
}: PokemonDetailsScreenProps) {
  const [favouritePokemonName, setFavouritePokemonName] = useState<
    string | null
  >(null);
  const [pokemon, setPokemon] = useState<PokemonStats | null>(null);
  const [isFetchingPokemon, setIsFetchingPokemon] = useState<boolean>(true);
  const [isLoadingFavouritePokemon, setIsLoadingFavouritePokemon] =
    useState<boolean>(true);

  const loadFavouritePokemon = useCallback(async () => {
    setIsLoadingFavouritePokemon(true);
    const favouriteName = await AsyncStorage.getItem(FAVOURITE_KEY);
    setFavouritePokemonName(favouriteName);
    setIsLoadingFavouritePokemon(false);
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsFetchingPokemon(true);
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
        );
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error("Pokemon fetch error:", error);
        setPokemon(null);
      } finally {
        setIsFetchingPokemon(false);
      }
    };
    fetchPokemon();
  }, [pokemonName]);

  useFocusEffect(
    useCallback(() => {
      loadFavouritePokemon();
    }, [loadFavouritePokemon]),
  );

  if (isFetchingPokemon || isLoadingFavouritePokemon) {
    return <Loader />;
  }

  if (!pokemon) {
    return <PokemonFetchFailed />;
  }

  const toggleFavourite = async () => {
    if (pokemonName === favouritePokemonName) {
      try {
        await AsyncStorage.removeItem(FAVOURITE_KEY);
        setFavouritePokemonName(null);
      } catch (error) {
        console.error("Unlike pokemon failed", error);
      }
    } else {
      try {
        if (pokemonName) {
          await AsyncStorage.setItem(FAVOURITE_KEY, pokemonName);
          setFavouritePokemonName(pokemonName);
        } else {
          await AsyncStorage.removeItem(FAVOURITE_KEY);
          setFavouritePokemonName(null);
        }
      } catch (error) {
        console.error("Like pokemon error", error);
      }
    }
  };

  const isFavourite = favouritePokemonName === pokemonName;

  return (
    <PokemonCard
      pokemon={pokemon}
      isLiked={isFavourite}
      toggleFavourite={toggleFavourite}
    />
  );
}
