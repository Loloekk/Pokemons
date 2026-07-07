import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import Loader from "../components/Loader";
import NoFavouritePokemon from "../components/NoFavourtiePokemon";
import PokemonCard from "../components/PokemonCard";
import FetchingPokemonFailed from "../components/PokemonFetchFailed";
import { FAVOURITE_KEY } from "../constants/storage";
import { PokemonStats } from "../types/pokemon";

export default function FavouritePokemonScreen() {
  const [favouritePokemonName, setFavouritePokemonName] = useState<
    string | null
  >(null);
  const [pokemon, setPokemon] = useState<PokemonStats | null>(null);
  const [isFetchingPokemon, setIsFetchingPokemon] = useState<boolean>(false);
  const [isLoadingFavouritePokemon, setIsLoadingFavouritePokemon] =
    useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(true);

  const loadFavouritePokemon = useCallback(async () => {
    setIsLoadingFavouritePokemon(true);
    const favouriteName = await AsyncStorage.getItem(FAVOURITE_KEY);
    if (favouriteName) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    setFavouritePokemonName(favouriteName);
    setIsLoadingFavouritePokemon(false);
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (isLoadingFavouritePokemon || !favouritePokemonName) return;
      setIsFetchingPokemon(true);
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${favouritePokemonName}`,
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
  }, [favouritePokemonName, isLoadingFavouritePokemon]);

  useFocusEffect(
    useCallback(() => {
      loadFavouritePokemon();
    }, [loadFavouritePokemon]),
  );

  if (isFetchingPokemon || isLoadingFavouritePokemon) {
    return <Loader />;
  }

  if (!favouritePokemonName) {
    return <NoFavouritePokemon />;
  }

  if (!pokemon) {
    return <FetchingPokemonFailed />;
  }

  const toggleFavourite = async () => {
    if (isLiked) {
      try {
        await AsyncStorage.removeItem(FAVOURITE_KEY);
        setIsLiked(false);
      } catch (error) {
        console.error("Unlike pokemon failed", error);
      }
    } else {
      try {
        await AsyncStorage.setItem(FAVOURITE_KEY, favouritePokemonName);
        setIsLiked(true);
      } catch (error) {
        console.error("Like pokemon error", error);
      }
    }
  };

  return (
    <PokemonCard
      pokemon={pokemon}
      isLiked={isLiked}
      toggleFavourite={toggleFavourite}
    />
  );
}
